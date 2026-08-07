-- Add standard_clauses to apartments
ALTER TABLE public.apartments ADD COLUMN IF NOT EXISTS standard_clauses TEXT[] DEFAULT '{}';

-- Update create_apartment function
CREATE OR REPLACE FUNCTION public.create_apartment(
  p_title TEXT,
  p_description TEXT,
  p_property_type property_type,
  p_rent NUMERIC,
  p_condo_fee NUMERIC,
  p_iptu NUMERIC,
  p_street TEXT,
  p_number TEXT,
  p_neighborhood_id UUID,
  p_city TEXT,
  p_state TEXT,
  p_zip_code TEXT,
  p_bedrooms INTEGER,
  p_bathrooms INTEGER,
  p_parking_spots INTEGER,
  p_area_m2 INTEGER,
  p_furnished BOOLEAN,
  p_pet_friendly BOOLEAN,
  p_floor INTEGER,
  p_amenities TEXT[],
  p_standard_clauses TEXT[]
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_apartment_id UUID;
  v_owner_id UUID;
BEGIN
  v_owner_id := auth.uid();
  
  IF v_owner_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  INSERT INTO public.apartments (
    title,
    description,
    property_type,
    rent,
    condo_fee,
    iptu,
    street,
    number,
    neighborhood_id,
    city,
    state,
    zip_code,
    bedrooms,
    bathrooms,
    parking_spots,
    area_m2,
    furnished,
    pet_friendly,
    floor,
    amenities,
    standard_clauses,
    owner_id
  )
  VALUES (
    p_title,
    p_description,
    p_property_type,
    p_rent,
    p_condo_fee,
    p_iptu,
    p_street,
    p_number,
    p_neighborhood_id,
    p_city,
    p_state,
    p_zip_code,
    p_bedrooms,
    p_bathrooms,
    p_parking_spots,
    p_area_m2,
    p_furnished,
    p_pet_friendly,
    p_floor,
    p_amenities,
    p_standard_clauses,
    v_owner_id
  )
  RETURNING id INTO v_apartment_id;

  -- Garante que o perfil agora é marcado como proprietário
  UPDATE public.profiles
  SET role = 'owner'
  WHERE id = v_owner_id AND role = 'tenant';

  RETURN v_apartment_id;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.create_apartment FROM public;
GRANT EXECUTE ON FUNCTION public.create_apartment TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_apartment TO service_role;