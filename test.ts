(() => {
  const contents=`
    import here from 'destination';
    import './assets/styles.css';
    import here from 'destination';
    `;

    console.log(
      contents.replace(/import ?("|')?\.\/assets\/styles?\.css("|')?;?/, "")
    );
})();
