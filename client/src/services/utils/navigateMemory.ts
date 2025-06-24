// utils/navigationMemory.ts
export const rememberCurrentLocation = () => {
  sessionStorage.setItem(
    "preLoginPath",
    window.location.pathname + window.location.search
  );
  sessionStorage.setItem("preLoginScroll", window.scrollY.toString());
};
