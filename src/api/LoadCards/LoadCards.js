export const loadCards = url => {
  return new Promise(resolve => {
    fetch(url)
      .then(response => response.json())
      .then(body => {
        resolve({ error: false, payload: body });
      });
  });
};
