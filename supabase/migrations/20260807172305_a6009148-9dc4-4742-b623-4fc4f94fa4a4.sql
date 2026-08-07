ALTER TABLE public.apartments ADD COLUMN standard_clauses TEXT[] DEFAULT '{}';
COMMENT ON COLUMN public.apartments.standard_clauses IS 'Default contract clauses defined by the owner for this property.';
