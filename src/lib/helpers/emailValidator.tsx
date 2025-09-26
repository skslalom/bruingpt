interface ValidateProps {
  email: string;
}

export const validate = (props: ValidateProps) => {
  const errors: Partial<ValidateProps> = {};

  if (props.email && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(props.email)) {
    errors.email = 'Please enter a valid email';
  }

  return errors;
};
