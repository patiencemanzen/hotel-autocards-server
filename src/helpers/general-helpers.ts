type CallbackFunction<T> = () => Promise<T>;
type ErrorCallback = (error: Error) => void;

export const tryCatch = async <T>(
  callback: CallbackFunction<T>,
  onError: ErrorCallback
): Promise<void> => {
  try {
    await callback();
  } catch (error) {
    console.log(error);
    onError(error);
  }
};
