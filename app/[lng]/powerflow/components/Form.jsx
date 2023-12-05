import { FormProvider, useForm } from "react-hook-form"



export default function Form({
  onSubmit,
  children,
  defaultValues = undefined
}) {
  const methods = useForm({
    defaultValues,
  })
  const handleSubmit = methods.handleSubmit;
  const reset = methods.reset;

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} onReset={reset}>
        {children}
      </form>
    </FormProvider>
  )
}

 