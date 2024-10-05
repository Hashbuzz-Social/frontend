// src/utils/localStorage.ts
export const saveState = (state: any) => {
  localStorage.setItem("hashbuzz-wc-saved-state", JSON.stringify(state));
};

export const loadState = () => {
  try {
    const state = localStorage.getItem("hashbuzz-wc-saved-state");
    console.log("state is called", state);
    if (state === null) {
      return undefined;
    }
    return JSON.parse(state);
  } catch (err) {
    console.log("error in loadState", err);
    console.log(err);
  }
};

export const clearState = () => {
  localStorage.removeItem("hashbuzz-wc-saved-state");
};
