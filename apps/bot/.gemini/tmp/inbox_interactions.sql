CREATE TABLE public.inbox_interactions (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  patient_id character varying NOT NULL,
  user_id uuid NULL, -- Assumindo que user_id se liga a inbox_users ou user_profiles
  type character varying NOT NULL,
  notes text NULL,
  created_at timestamp with time zone NULL DEFAULT now(),
  CONSTRAINT inbox_interactions_pkey PRIMARY KEY (id)
);