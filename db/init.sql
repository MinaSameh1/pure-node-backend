--- Create the database.
CREATE TABLE IF NOT EXISTS public."books" (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title text NOT NULL,
    author text NOT NULL,
    isbn text NOT NULL,
    avaliable_quantity int NOT NULL,
    shelf_location text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public."borrower"
(
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    name text NOT NULL,
    email text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT borrower_pkey PRIMARY KEY (id),
    CONSTRAINT borrower_email UNIQUE (email)
);

CREATE TABLE IF NOT EXISTS public.borrowerd_books
(
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    borrower uuid NOT NULL,
    book uuid NOT NULL,
    due_date date NOT NULL,
    checked_out_date timestamptz NOT NULL DEFAULT now(),
    return_date timestamptz,
    CONSTRAINT borrowers_pkey PRIMARY KEY (id),
    CONSTRAINT borrowers_book_fkey FOREIGN KEY (book)
    REFERENCES public.books (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID,
    CONSTRAINT borrowers_borrower_fkey FOREIGN KEY ("borrower")
    REFERENCES public."borrower" (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID
);


CREATE TYPE public.transaction_type AS ENUM
('checkout', 'return');

--- Keep track of all the transactions done by the user.
CREATE TABLE IF NOT EXISTS public."borrow_transactions_log"
(
    book_id uuid NOT NULL,
    borrower_id uuid NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    transation_type transaction_type NOT NULL,
    CONSTRAINT "transactions_book_fkey" FOREIGN KEY (book_id)
    REFERENCES public.books (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION,
    CONSTRAINT "transactions_borrower_fkey" FOREIGN KEY (borrower_id)
    REFERENCES public."borrower" (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
);
