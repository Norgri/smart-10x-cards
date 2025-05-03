-- Create a function to log flashcard actions and create flashcards when needed
create or replace function public.log_flashcard_action(
  p_session_id text,
  p_user_id text,
  p_action_type text,
  p_flashcard_data jsonb
) returns table (
  id bigint,
  session_id text,
  flashcard_id bigint,
  action_type text,
  created_at timestamptz
) language plpgsql security definer as $$
declare
  v_flashcard_id bigint;
  v_log_id bigint;
  v_tag text;
begin
  -- Start transaction
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
      p_session_id::bigint,
      v_flashcard_id,
      p_action_type,
      p_user_id::uuid,
      now()
    )
    returning id into v_log_id;

    -- Return the result
    return query
    select
      la.id,
      la.generation_session_id,
      la.flashcard_id,
      la.action_type,
      la.created_at
    from public.log_action la
    where la.id = v_log_id;

    -- Commit transaction
    commit;
  exception
    when others then
      -- Rollback transaction on error
      rollback;
      raise;
  end;
end;
$$; 