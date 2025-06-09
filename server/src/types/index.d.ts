// // src/types/index.d.ts
// import { Types } from 'mongoose'

// declare global {
//   namespace Express {
//     interface User {
//       _id: Types.ObjectId
//       role: string
//     }

//     interface Request {
//       user?: User
//     }
//   }
// }

// export {}

// src/types/express/index.d.ts

import { IUser } from '../../modules/user/user.model'

declare global {
  namespace Express {
    interface Request {
      user?: IUser
    }
  }
}
