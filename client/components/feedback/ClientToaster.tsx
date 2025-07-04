// 'use client'

// import { Toaster } from 'sonner'

// const ClientToaster = () => {
//   return <Toaster position='top-center' richColors closeButton />
// }

// export default ClientToaster

// components/feedback/ClientToaster.tsx
'use client'

import { Toaster } from 'react-hot-toast'

const ClientToaster = () => {
  return <Toaster position='top-center' reverseOrder={false} />
}

export default ClientToaster
