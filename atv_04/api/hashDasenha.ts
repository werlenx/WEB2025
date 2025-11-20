import bcrypt = require("bcrypt");

const password = "sucoDeMortadela";
const saltRounds = 10;

async function hashPassword() {
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  console.log(`Senha Hasheada (Hash): ${hashedPassword}`);
}

hashPassword();
