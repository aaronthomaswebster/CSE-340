-- 1. Insert Tony Stark into the account table
INSERT INTO PUBLIC.ACCOUNT(
    ACCOUNT_FIRSTNAME,
    ACCOUNT_LASTNAME,
    ACCOUNT_EMAIL,
    ACCOUNT_PASSWORD
) VALUES (
    'Tony',
    'Stark',
    'tony@starkent.com',
    'am1ronM@n'
);


-- 2. Change Tony Stark's account type to Admin
UPDATE PUBLIC.ACCOUNT
SET
    ACCOUNT_TYPE= 'Admin'
WHERE
    ACCOUNT_EMAIL = 'tony@starkent.com';


-- 3. Delete Tony Stark from the account table
DELETE FROM PUBLIC.ACCOUNT
WHERE
    ACCOUNT_EMAIL = 'tony@starkent.com';


-- 4. Change the description of the GM Hummers from "small interiors" to "a huge interior"
UPDATE PUBLIC.INVENTORY
SET
    INV_DESCRIPTION = REPLACE(
        INV_DESCRIPTION,
        'small interiors',
        'a huge interior'
    )
WHERE
    INV_MAKE = 'GM'
    AND INV_MODEL = 'Hummer';

-- 5. view all sprot vehicles
SELECT inv_make, inv_model
FROM public.inventory i
JOIN public.classification c on i.classification_id = c.classification_id
WHERE c.classification_name = 'Sport';

--6. update image and thumbnail values
UPDATE PUBLIC.INVENTORY
SET
    inv_image  = REPLACE(
        inv_image ,
        '/images/',
        '/images/vehicles/'
    )
SET
    inv_thumbnail  = REPLACE(
        inv_thumbnail ,
        '/images/',
        '/images/vehicles/'
    );