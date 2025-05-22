-- Insert a new account
INSERT INTO account (
        account_firstname,
        account_lastname,
        account_email,
        account_password
    )
VALUES (
        'Tony',
        'Stark',
        'tony@starkent.com',
        'Iam1ronM@n'
    );
-- Modify 'Tony Stark record'
UPDATE account
SET account_type = 'Admin'
WHERE account_email = 'tony@starkent.com';
-- Delete 'Tony Stark record'
DELETE FROM account
WHERE account_email = 'tony@starkent.com';
-- Update the 'inv_description' of the 'Hummer' model
UPDATE inventory
SET inv_description = REPLACE(
        inv_description,
        'small interiors',
        'a huge interior'
    )
WHERE inv_make = 'GM'
    AND inv_model = 'Hummer';
-- Inner join 'inventory' and 'classification' tables
SELECT inventory.inv_make,
    inventory.inv_model,
    classification.classification_name
FROM inventory
    INNER JOIN classification ON inventory.classification_id = classification.classification_id
WHERE classification.classification_name = 'Sport';
-- Update the 'inv_image' and 'inv_thumbnail' paths
UPDATE inventory
SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');