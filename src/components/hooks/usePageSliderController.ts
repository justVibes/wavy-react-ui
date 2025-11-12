function usePageSliderController(defaultPage = 0) {
  return {
    defaultPage,
    goTo: (_: number): void => null,
    getActivePage: (): number => null,
    isPageActive: (_: number): boolean => null,
    onPageChange: (_: (_: number) => void): void => null,
  };
}

type UsePageSliderControllerReturn = ReturnType<typeof usePageSliderController>;

export default usePageSliderController;
export type { UsePageSliderControllerReturn };
