// Enhance the four existing install recipes; the full list is readable without JS.
const recipes = document.querySelector('#install .screens');
const panels = Array.from(recipes.querySelectorAll('article'));
const picker = document.createElement('div');
picker.className = 'host-picker';
picker.setAttribute('role', 'group');
picker.setAttribute('aria-label', '编程助手');
recipes.before(picker);
const selectors = panels.map((panel, index) => {
  const title = panel.querySelector('h3').textContent;
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = title;
  panel.id = 'host-' + index;
  button.setAttribute('aria-controls', panel.id);
  picker.append(button);
  const copy = document.createElement('button');
  copy.type = 'button';
  copy.className = 'copy-install';
  copy.textContent = '复制安装命令';
  panel.querySelector('h3').after(copy);
  copy.addEventListener('click', async () => {
    const code = panel.querySelector('code');
    try {
      await navigator.clipboard.writeText(code.textContent.split('\n')[0]);
      copy.textContent = '已复制';
      setTimeout(() => { copy.textContent = '复制安装命令'; }, 1500);
    } catch {
      const range = document.createRange();
      range.selectNodeContents(code.firstChild);
      range.setEnd(code.firstChild, code.textContent.indexOf('\n'));
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
    }
  });
  return button;
});
function selectHost(index) {
  panels.forEach((panel, i) => {
    panel.hidden = i !== index;
    selectors[i].setAttribute('aria-pressed', String(i === index));
  });
}
selectors.forEach((button, i) => button.addEventListener('click', () => selectHost(i)));
recipes.classList.add('host-recipes');
selectHost(0);
