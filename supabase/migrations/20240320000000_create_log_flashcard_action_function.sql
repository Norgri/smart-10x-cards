-- Create a function to log flashcard actions and create flashcards when needed
create or replace function public.log_flashcard_action(
  p_session_id bigint,
  p_user_id text,
  p_action_type varchar(10),
  p_flashcard_data jsonb
) returns table (
  log_id bigint,
  session_id bigint,
  flashcard_id bigint,
  action_type varchar(10),
  created_at timestamptz
) language plpgsql security definer as $$
declare
  v_flashcard_id bigint;
  v_log_id bigint;
  v_tag text;
begin
  -- Verify session exists before proceeding
  if not exists (
    select 1 
    from public.generation_session 
    where id = p_session_id
  ) then
    raise exception 'Generation session not found' using errcode = 'NTFND';
  end if;

  begin
    -- If action is 'accepted' or 'edited', create a flashcard
    if p_action_type in ('accepted', 'edited') then
      -- Insert the flashcard without tags
      insert into public.flashcards (
        front,
        back,
        phonetic,
        source,
        user_id,
        created_at,
        updated_at
      )
      select
        (p_flashcard_data->>'front')::text,
        (p_flashcard_data->>'back')::text,
        (p_flashcard_data->>'phonetic')::text,
        'ai'::text,
        p_user_id::uuid,
        now(),
        now()
      returning id into v_flashcard_id;

      -- Insert tags into the tags table
      for v_tag in select jsonb_array_elements_text(p_flashcard_data->'tags')
      loop
        insert into public.tags (
          flashcard_id,
          tag,
          created_at,
          updated_at
        )
        values (
          v_flashcard_id,
          v_tag,
          now(),
          now()
        );
      end loop;
    end if;

    -- Log the action
    insert into public.log_action (
      generation_session_id,
      flashcard_id,
      action_type,
      user_id,
      created_at
    )
    values (
      p_session_id,
      v_flashcard_id,
      p_action_type,
      p_user_id::uuid,
      now()
    )
    returning id into v_log_id;

    -- Return the result
    return query
    select
      la.id as log_id,
      la.generation_session_id as session_id,
      la.flashcard_id,
      la.action_type,
      la.created_at
    from public.log_action la
    where la.id = v_log_id;

  exception
    when others then
      raise;
  end;
end;
$$; 