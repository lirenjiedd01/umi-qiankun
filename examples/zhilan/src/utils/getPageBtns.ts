export function getBtns(allBtnsData: any, path: string) {
  let btns: any[] = [];
  if (!path || (!allBtnsData && allBtnsData.length === 0)) {
    return;
  }
  btns = allBtnsData.find(item => item.path === path).btnsList;

  return btns;
}

export function getBtnCode(btns: any[] | undefined, code: string) {
  if (!btns || btns.length === 0 || !code) return false;
  let codes = btns.find((item: any) => {
    return `${item.code }` === code;
  });
  if (codes) {
    return true;
  }
    return false;

}
