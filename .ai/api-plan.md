# REST API Plan

## 1. Resources

1. **Users**
   - Maps to the `users` table.
   - Key fields: id, email, encrypted_password, first_name, last_name, last_login, created_at, updated_at, confirmed_at.

2. **Flashcards**
   - Maps to the `flashcards` table.
   - Key fields: id, user_id, front, back, phonetic, source (must be either 'ai' or 'manual'), created_at, updated_at.
   - Validation: Ensure that flashcards contain required fields (front, back) and, if applicable, at most 4 associated tags.

3. **Tags**
   - Maps to the `tags` table.
   - Each tag is linked to a flashcard via flashcard_id.
   - Validation: Enforce unique combination of flashcard_id and tag (max 4 tags per flashcard).

4. **GenerationSessions**
   - Maps to the `generation_session` table.
   - Key fields: id, user_id, generation_duration, model, created_at, updated_at.
   - Purpose: Track each AI-driven flashcard generation process.

5. **LogActions**
   - Maps to the `log_action` table.
   - Records actions performed on flashcards (accepted, edited, deleted).
   - Key fields: id, user_id, generation_session_id, flashcard_id, action_type, created_at.

6. **GenerationErrors**
   - Maps to the `generation_error` table.
   - Logs errors encountered during AI generation sessions.
   - Key fields: id, session_id, error_code, error_message, created_at.

## 2. Endpoints

Each endpoint will follow RESTful principles using appropriate HTTP methods and will include pagination, filtering, and proper error handling where applicable.

### B. Flashcards

#### 1. Manual Flashcard Operations

- **List Flashcards**
  - **Method:** GET
  - **URL:** /api/flashcards
  - **Description:** Retrieves a paginated list of flashcards for the authenticated user; supports filtering by tags.
  - **Query Parameters:**
    - `page` (number): Page number.
    - `limit` (number): Number of items per page.
    - `tags` (array of string, optional): Filter flashcards by one or more tags (e.g., /api/flashcards?tags=tag1&tags=tag2).
  - **Response:**
    - 200 OK with a JSON array of flashcards and pagination info.

- **Get Flashcard**
  - **Method:** GET
  - **URL:** /api/flashcards/{id}
  - **Description:** Retrieves details of a specific flashcard.
  - **Response:**
    - 200 OK with flashcard details.
    - 404 Not Found if flashcard does not exist or does not belong to the user.

- **Create Flashcard (Manual)**
  - **Method:** POST
  - **URL:** /api/flashcards
  - **Description:** Creates a new flashcard manually.
  - **Request Payload:**
    ```json
    {
      "front": "Sample front text",
      "back": "Sample back text",
      "phonetic": "Optional phonetic",
      "tags": ["tag1", "tag2"]
    }
    ```
  - **Response:**
    ```json
    {
      "id": 1,
      "front": "Sample front text",
      "back": "Sample back text",
      "phonetic": "Optional phonetic",
      "source": "manual",
      "createdAt": "2023-10-01T12:00:00Z",
      "updatedAt": "2023-10-01T12:00:00Z",
      "userId": "user-uuid",
      "tags": ["tag1", "tag2"]
    }
    ```

- **Update Flashcard**
  - **Method:** PUT
  - **URL:** /api/flashcards/{id}
  - **Description:** Updates an existing flashcard including editing tags.
  - **Request Payload:**
    ```json
    {
      "id": 1,
      "front": "Updated front text",
      "back": "Updated back text",
      "phonetic": "Optional phonetic",
      "tags": ["tag1", "tag2"]
    }
    ```
  - **Response:**
    ```json
    {
      "id": 1,
      "front": "Updated front text",
      "back": "Updated back text",
      "phonetic": "Optional phonetic",
      "source": "manual",
      "createdAt": "2023-10-01T12:00:00Z",
      "updatedAt": "2023-10-01T12:05:00Z",
      "userId": "user-uuid",
      "tags": ["tag1", "tag2"]
    }
    ```

- **Delete Flashcard**
  - **Method:** DELETE
  - **URL:** /api/flashcards/{id}
  - **Description:** Deletes a flashcard identified by its id.
  - **Response:**
    - 200 OK with a confirmation message.
    - 404 if flashcard not found.

#### 2. AI-Generated Flashcard Operations

- **Generate Flashcards from Image**
  - **Method:** POST
  - **URL:** /api/generation-sessions
  - **Description:** Initiates an AI generation process by accepting an image upload. Creates a generation session and returns generated flashcards.
  - **Request Payload:**
    - Multipart/form-data containing:
      - `image`: The image file (JPG or PNG).
  - **Response:**
    ```json
    {
      "id": "session-123",
      "flashcards": [
        {
          "front": "Generated front text",
          "back": "Generated back text",
          "phonetic": "Optional phonetic",
          "tags": ["tag1", "tag2"],
          "source": "ai"
        }
      ],
      "errors": [
        {
          "id": 123,
          "errorCode": "Error code of failed generation",
          "errorMessage": "Error message"
        }
      ],
      "createdAt": "2023-10-01T12:00:00Z"
    }
    ```
  - **Validation:**
    - The image must be in JPG or PNG format and within the file size limit.
    - All required parameters must be provided.
  - **Error Codes:**
    - 400 for invalid file type or missing parameters.
    - 500 for AI processing errors.

### C. Generation Sessions & Errors

- **List Generation Sessions**
  - **Method:** GET
  - **URL:** /api/generation-sessions
  - **Description:** Retrieves a list of AI generation sessions for the authenticated user.
  - **Response:**
    - 200 OK with the session data.

- **Get Generation Session Details**
  - **Method:** GET
  - **URL:** /api/generation-sessions/{id}
  - **Description:** Retrieves details of a specific generation session along with associated flashcards.
  - **Response:**
    - 200 OK with session details.
    - 404 if session does not exist.

- **List Generation Errors for a Session**
  - **Method:** GET
  - **URL:** /api/generation-sessions/{session_id}/errors
  - **Description:** Retrieves errors logged for a specific generation session.
  - **Response:**
    - 200 OK with a list of error entries.

### C. Action Logging within Generation Sessions

- **Log Generated Flashcard Action**
  - **Method:** POST
  - **URL:** /api/generation-sessions/{session_id}/flashcard-actions
  - **Description:** Logs a user action on a generated flashcard. For 'accepted' or 'edited' actions, a flashcard record is automatically created.
  - **Request Payload:**
    ```json
    {
      "actionType": "accepted",
      "generatedFlashcard": {
        "front": "Generated front text",
        "back": "Generated back text",
        "phonetic": "Optional phonetic",
        "tags": ["tag1", "tag2"],
        "source": "ai"
      }
    }
    ```
  - **Response:**
    ```json
    {
      "id": 456,
      "sessionId": "session-123",
      "flashcardId": 789,
      "actionType": "accepted",
      "timestamp": "2023-10-01T12:05:00Z"
    }
    ```
  - **Validation:**
    - The `actionType` field must be one of "accepted", "edited", or "rejected".
    - For accepted or edited flashcards, the system will automatically create a record in the `flashcards` table with an auto-generated `id`.
  - **Error Codes:**
    - 400 for invalid action types.
    - 404 if the specified generation session is not found.

## 3. Authentication and Authorization

- **Mechanism:**
  - The API utilizes Supabase Auth with JWT tokens for authentication.
  - Each request requiring authentication must include an `Authorization: Bearer <token>` header.
  - Row-Level Security (RLS) is enforced at the database level (as defined in the db schema) to ensure users can only access their own records.
  - Endpoints will validate the JWT and extract the user id to apply the necessary database filters.

## 4. Validation and Business Logic

- **Validation Rules**
  - Flashcard creation/update requires non-empty `front` and `back` fields.
  - Only up to 4 tags are allowed per flashcard; this should be validated both on the client and server side.
  - For image uploads, validate file type (e.g., JPG, PNG) and size limits.

- **Business Logic Mapping (from PRD):**
  - **User Registration and Login:** Implements basic authentication workflows (FR-001 and FR-002).
  - **Image Upload and AI Generation (FR-003 & FR-004):** The `/api/generation-sessions` endpoint processes an image to create flashcards and tag suggestions using external AI services (e.g., OpenRouter).
  - **Flashcard Review and Action Logging (FR-005, FR-006, FR-007 & FR-008):** Users can review generated flashcards and perform actions such as accept, edit, or delete. Each action is logged via the `/api/generation-sessions/{session_id}/flashcard-actions` endpoint, storing the action in `log_action` for analytical purposes.
  - **Manual Flashcard Management (FR-009 to FR-013):** Provides full CRUD operations for manual flashcard creation, search by tags, and editing/deletion of existing flashcards.
  - **Error Handling (FR-014 & FR-015):** Errors encountered during AI generation are logged in the `generation_error` table and can be retrieved for debugging and user notifications.
  - **Optional Phonetic Field (FR-016):** The phonetic field is optional; absence of data should not cause errors.

- **Performance and Security:**
  - Utilize the indexed columns (e.g., email in `users`, user_id in `flashcards`, etc.) to optimize query performance.
  - Implement rate limiting to protect against abuse and ensure stable API performance.
  - Validate all incoming data to prevent SQL injection and other common vulnerabilities.
  - Ensure that error messages are user-friendly while logging detailed errors for developers.

## 5. Additional Considerations

- **Pagination & Filtering:** Endpoints listing resources (e.g., flashcards, generation sessions) will support pagination and filtering (such as by tag).

- **HTTP Status Codes & Error Messages:** All endpoints will return standard HTTP status codes (200, 201, 400, 401, 403, 404, 500) and descriptive messages to inform the client of the result.

- **Deployment and Tech Stack Alignment:**
  - Built using Astro with React components, TypeScript for static typing, and styled with Tailwind and Shadcn/ui components on the frontend.
  - The backend leverages Supabase (PostgreSQL) with RLS for data security, aligning with the provided architecture and performance requirements.

- **Assumptions:**
  - The AI generation process is assumed to be synchronous for MVP or handled asynchronously with polling mechanisms.
  - File uploads and processing are managed via dedicated services/endpoints with proper validation and error handling. 