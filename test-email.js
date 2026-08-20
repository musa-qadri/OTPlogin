const { validate } = require('deep-email-validator');
async function test() {
  const res = await validate('fakeemail12345qwerqwer@gmail.com');
  console.log(res);
}
test();
