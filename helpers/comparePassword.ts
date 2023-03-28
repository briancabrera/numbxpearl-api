import bcrypt from 'bcrypt'

export const compare = (password, hash) => {
    return bcrypt.compare(password, hash, (err, isMatch) => {
        if (err) {
          return false
        } else if (isMatch) {
          return true
        }
      });
}   