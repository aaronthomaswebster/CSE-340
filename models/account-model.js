const pool = require("../database/");

/* *****************************
 *   Register new account
 * *************************** */
async function registerAccount(
  account_firstname,
  account_lastname,
  account_email,
  account_password
) {
  try {
    const sql =
      "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *";
    return await pool.query(sql, [
      account_firstname,
      account_lastname,
      account_email,
      account_password,
    ]);
  } catch (error) {
    return error.message;
  }
}

/* **********************
 *   Check for existing email
 * ********************* */
async function checkExistingEmail(account_email) {
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1";
    const email = await pool.query(sql, [account_email]);
    return email.rowCount;
  } catch (error) {
    return error.message;
  }
}


/* *****************************
* Return account data using email address
* ***************************** */
async function getAccountByEmail (account_email) {
  try {
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1',
      [account_email])
    return result.rows[0]
  } catch (error) {
    return new Error("No matching email found")
  }
}

/* *****************************
* update account data
* ***************************** */
async function updateAccount (account_firstname, account_lastname, account_email, account_id) {
  try {
    const result = await pool.query(
     'UPDATE account SET account_firstname = $1, account_lastname = $2, account_email = $3 WHERE account_id = $4 RETURNING *',
     [account_firstname, account_lastname, account_email, account_id] 
     )
    return result.rows[0]
  } catch (error) {
    return new Error("account update failed")
  }
}

/* *****************************
* Return account data using email address
* ***************************** */
async function changePassword (hased_password, account_id) {
  try {
    const result = await pool.query(
      'UPDATE account SET account_password = $1 WHERE account_id= $2 RETURNING *',
      [hased_password, account_id])
    return result.rows[0]
  } catch (error) {
    return new Error("Password change failed")
  }
}



/* ***************************
 *  Get all favorite inventory items
 * ************************** */
async function getMyFavorites(account_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
        JOIN public.classification AS c 
        ON i.classification_id = c.classification_id 
        JOIN public.favorites AS f
        on f.inv_id = i.inv_id and f.account_id = $1`,
      [account_id]
    );
    return data.rows;
  } catch (error) {
    console.log({error})
    console.error("getclassificationsbyid error " + error);
  }
}

async function addFavorite(account_id, inv_id) {
  try {
    const data = await pool.query(
      `INSERT INTO public.favorites (account_id, inv_id) VALUES ($1, $2)`,
      [account_id, inv_id]
    );
    return data.rows;
  } catch (error) {
    console.log({error})
    console.error("getclassificationsbyid error " + error);
  }
}

async function removeFavorite(account_id, inv_id) {
  try {
    const data = await pool.query(
      `DELETE FROM public.favorites WHERE account_id = $1 and inv_id = $2`,
      [account_id, inv_id]
    );
    return data.rows;
  } catch (error) {
    console.log({error})
    console.error("getclassificationsbyid error " + error);
  }
}


module.exports = { registerAccount, checkExistingEmail,getAccountByEmail, updateAccount, changePassword, getMyFavorites, addFavorite, removeFavorite};
