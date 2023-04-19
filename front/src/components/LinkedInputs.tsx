import {
  Children,
  cloneElement,
  isValidElement,
  createRef,
  ReactElement,
  RefObject,
  useMemo
} from 'react';
import { TextInput, View, ViewProps } from 'react-native';
import { FormikTextInputProps } from 'types';

interface Props extends Omit<ViewProps, 'children'> {
  children: ReactElement<FormikTextInputProps>[];
}

const LinkedInputs = ({ children }: Props): JSX.Element => {
  const renderInputs = (): ReactElement<FormikTextInputProps>[] | boolean => {
    const refs = Array.from(
      { length: Children.count(children) },
      (): RefObject<TextInput> => createRef()
    );

    const childrenToReturn: ReactElement<FormikTextInputProps>[] = [];

    if (!children) {
      return false;
    }

    Children.map(children, (child, index): void => {
      if (isValidElement(child)) {
        const end = index === children.length - 1;

        const cloned = !end
          ? cloneElement(child, {
              key: child.props.name,
              inputRef: refs[index],
              returnKeyType: 'next',
              blurOnSubmit: false,
              onSubmitEditing: (): void => {
                refs[index + 1].current?.focus();
              }
            })
          : cloneElement(child, {
              key: child.props.name,
              inputRef: refs[index]
            });

        childrenToReturn.push(cloned);
      }
    });
    return childrenToReturn;
  };

  const inputs = useMemo(renderInputs, [children]);

  return <View>{inputs}</View>;
};

export default LinkedInputs;
