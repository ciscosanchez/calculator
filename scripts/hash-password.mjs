#!/usr/bin/env node

import bcrypt from 'bcryptjs'

const password = process.argv[2]

if (!password) {
  console.error('Usage: npm run hash-password <password>')
  process.exit(1)
}

const hash = bcrypt.hashSync(password, 10)
console.log('\nPassword hash:')
console.log(hash)
console.log('\nUse this hash when creating users in the database.')
