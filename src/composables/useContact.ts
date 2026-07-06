const phone = import.meta.env.VITE_BASE_PHONE
const tel = import.meta.env.VITE_BASE_TEL
const email = import.meta.env.VITE_BASE_EMAIL
const address = import.meta.env.VITE_BASE_ADDRESS

export const useContact = () => {
  return {
    title: 'Queremos ouvir de você',
    subtitle: 'Adoramos que você chegou até aqui. Mande uma mensagem e vamos conversar sobre como ajudar sua empresa.',
    phone,
    tel,
    email,
    address,
  }
}
