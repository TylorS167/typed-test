export function createHtmlFile(testRequirePaths: ReadonlyArray<string>, timeout: number) {
  return `
  <html>
    <head>
      <title>@typed/test</title>
    </head>
    <body>
      <div id="container"></div>
      <script src="./bundle.js"></script>
      <script>
        const log = console.log
        console.log = function (...args) {
          log.apply(console, args)
          fetch(location.origin + '/log', {
            method: 'POST',
            headers: new Headers({ 'Content-Type': 'application/json' }),
            body: JSON.stringify(args.map(JSON.stringify))
          })
        }

        var tests = []
        var TypedTest = require('@typed/test')

        function addTests(requirePath) {
          const pkg = require(requirePath)

          if (isTest(pkg)) tests.push(pkg)

          for (const key in pkg) {
            if (isTest(pkg[key])) tests.push(pkg[key])
          }
        }

        function isTest(x) {
          return x && x.hasOwnProperty('only') && typeof x.run === 'function'
        }
        
        ${JSON.stringify(testRequirePaths)}.forEach(addTests)

        Promise.all(tests.map(test => test.run(${timeout})))
          .then(results => {
            var overallResults = new TypedTest.TestResults('', results)

            var report = overallResults.report()
            var failed = report.failed
            var passed = report.passed

            var headers = new Headers({ 'Content-Type': 'application/json' })

            const rootNode = document.querySelector('#container')

            const passing = document.createElement('h3')
            passing.textContent = String(passed) + ' Passing'

            const failing = document.createElement('h3')
            failing.textContent = String(failed) + ' Failed'

            rootNode.appendChild(failing)
            rootNode.appendChild(passing)

            return fetch(location.origin + '/end-server', { 
              method: 'POST',
              headers,
              body: JSON.stringify({
                passed: passed,
                failed: failed,
                toString: overallResults.toString(),
                errors: overallResults.errors(),
              })
            })
          })
      </script>
    </body>
  </html>
  `
}
