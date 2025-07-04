// 'use client'

// import React from 'react'
// import { CheckCircle, XCircle } from 'lucide-react'

// interface Props {
//   password: string
// }

// const PasswordHints: React.FC<Props> = ({ password }) => {
//   const validations = {
//     length: password.length >= 8,
//     uppercase: /[A-Z]/.test(password),
//     number: /\d/.test(password),
//     special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
//   }

//   const getIcon = (isValid: boolean) =>
//     isValid ? (
//       <CheckCircle className='inline w-4 h-4 text-green-500 mr-1' />
//     ) : (
//       <XCircle className='inline w-4 h-4 text-red-400 mr-1' />
//     )

//   return (
//     <div className='text-sm text-gray-800 bg-gray-50 border border-gray-200 px-4 py-2 rounded-md shadow-sm mt-1'>
//       <p className='mb-1 font-semibold'>Password must include:</p>
//       <ul className='list-none space-y-1 ml-1'>
//         <li>
//           {getIcon(validations.length)} At least <strong>8 characters</strong>
//         </li>
//         <li>
//           {getIcon(validations.uppercase)} One <strong>uppercase letter</strong>
//         </li>
//         <li>
//           {getIcon(validations.number)} One <strong>number</strong>
//         </li>
//         <li>
//           {getIcon(validations.special)} One <strong>special character</strong>{' '}
//           (e.g. !@#$%)
//         </li>
//       </ul>
//     </div>
//   )
// }

// export default PasswordHints

'use client'

import React from 'react'

interface PasswordHintsProps {
  password: string
}

const PasswordHints: React.FC<PasswordHintsProps> = ({ password }) => {
  const rules = [
    { label: 'At least 8 characters', valid: password.length >= 8 },
    { label: 'One uppercase letter', valid: /[A-Z]/.test(password) },
    { label: 'One number', valid: /\d/.test(password) },
    { label: 'One special character', valid: /[!@#$%^&*]/.test(password) },
  ]

  return (
    <div className='text-sm text-gray-600 mt-2'>
      <p className='font-medium'>Password must include:</p>
      <ul className='ml-4 list-disc'>
        {rules.map((rule, idx) => (
          <li
            key={idx}
            className={rule.valid ? 'text-green-600' : 'text-red-500'}
          >
            {rule.label}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default PasswordHints
