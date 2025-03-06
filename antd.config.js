export const antdConfig = {
  theme: {
    primaryColor: '#88C9DB',
    linkColor: '#88C9DB',
    successColor: '#52c41a',
    warningColor: '#faad14',
    errorColor: '#f5222d',
    fontSizeBase: '14px',
    headingColor: 'rgba(0, 0, 0, 0.85)',
    textColor: 'rgba(0, 0, 0, 0.65)',
    textColorSecondary: 'rgba(0, 0, 0, 0.45)',
    disabledColor: 'rgba(0, 0, 0, 0.25)',
    borderRadiusBase: '2px',
    borderColorBase: '#d9d9d9',
    boxShadowBase: '0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 9px 28px 8px rgba(0, 0, 0, 0.05)'
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