export const antdConfig = {
  theme: {
    token: {
      colorPrimary: '#88C9DB',
      colorLink: '#88C9DB',
      colorSuccess: '#52c41a',
      colorWarning: '#faad14',
      colorError: '#f5222d',
      fontSize: 14,
      colorText: 'rgba(0, 0, 0, 0.65)',
      colorTextSecondary: 'rgba(0, 0, 0, 0.45)',
      colorTextDisabled: 'rgba(0, 0, 0, 0.25)',
      borderRadius: 2,
      colorBorder: '#d9d9d9',
      boxShadow: '0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 9px 28px 8px rgba(0, 0, 0, 0.05)'
    }
  },
  form: {
    validateMessages: {
      required: "Es requerido llenar este campo",
      string: {
        len: "El campo debe tener ${len} caracteres",
        max: "El campo debe de tener menos de ${min} caracteres",
        min: "El campo debe de tener por lo menos ${min} caracteres"
      },
      number: {
        min: "El campo no puede ser menor que ${min}",
        max: "El campo no puede ser mayor que ${max}"
      }
    }
  }
} 