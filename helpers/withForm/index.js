import { Alert } from "antd"

export function withForm(func) {
  return function component({
    data,
    isLoading,
    ...props
  }) {
    if(isLoading) {
      return null
    }

    if(!data) {
      return (
        <Alert
          message="Error"
          description="Ha ocurrido un error al cargar los datos de esta sección,
          por favor actualiza la página."
          type="error"
          showIcon />
      )
    }

    return func({ data, isLoading, ...props })
  }
}
