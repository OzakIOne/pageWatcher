# Page watcher

This node script will watch a specific text pattern on a certain page

When the pattern will match, the page will be closed and the script may open the page on your browser and play the alarm sound if the user set it to true

# How to use

Open the `index.js` and change the pages URL and others options which are self explanitory. Options are an array of objects.

```js
{
  URL: 'https://github.com/',
  SELECTOR: 'h1',
  PATTERN: 'Where the world builds software',
  REFRESH_INTERVAL_MIN: 1,
  openAlarm: false,
  openURL: false,
}
```

`URL`, `SELECTOR`, `PATTERN`, `REFRESH_INTERVAL_MIN` or `REFRESH_INTERVAL_SEC` are mandatory

To start the program

```bash
git clone https://github.com/ozakione/pagewatcher
cd pagewatcher
npm i
# Change options as said above
node index.js
```

# TODO

- [ ] cli arguments
