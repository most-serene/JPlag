// Ensures that different styles of passing submissions are supported
import { expect, test } from '@playwright/test'
import { uploadFile } from './TestUtils'

interface DataSet {
  datasetName: string
  firstSubmissionName: string
  secondSubmissionName: string
}

const testSets: DataSet[] = [
  {
    datasetName: 'fileSingleRoot-report.jplag',
    firstSubmissionName: '0.java',
    secondSubmissionName: '1.java'
  },
  {
    datasetName: 'folderSingleRoot-report.jplag',
    firstSubmissionName: '0',
    secondSubmissionName: '1'
  },
  {
    datasetName: 'fileMultiRoot-report.jplag',
    firstSubmissionName: 'f0\\\\|/0.java',
    secondSubmissionName: 'f1\\\\|/1.java'
  },
  {
    datasetName: 'mixedBaseFile-report.jplag',
    firstSubmissionName: 'f0\\\\|/0.java',
    secondSubmissionName: 'f1\\\\|/1'
  },
  {
    datasetName: 'mixedBaseFolder-report.jplag',
    firstSubmissionName: 'f0\\\\|/0.java',
    secondSubmissionName: 'f1\\\\|/1'
  },
  {
    datasetName: 'folderMultiRoot-report.jplag',
    firstSubmissionName: 'f0\\\\|/0',
    secondSubmissionName: 'f1\\\\|/1'
  },
  {
    datasetName: 'python-report.jplag',
    firstSubmissionName: '01.py',
    secondSubmissionName: '02.py'
  },
  {
    datasetName: 'cpp-report.jplag',
    firstSubmissionName: '01.cpp',
    secondSubmissionName: '02.cpp'
  },
  {
    datasetName: 'csharp-report.jplag',
    firstSubmissionName: '01.cs',
    secondSubmissionName: '02.cs'
  }
]

for (const testSet of testSets) {
  test(`Can open ${testSet.datasetName}`, async ({ page }) => {
    await uploadFile(testSet.datasetName, page)

    const comparisonTable = await page.getByText('Cluster 1').textContent()

    const lineRegEx = RegExp('1' + testSet.firstSubmissionName + testSet.secondSubmissionName)
    expect(comparisonTable).toMatch(lineRegEx)
    await page.getByText(lineRegEx).click()
    await page.waitForURL(/\/comparison\/.*/)

    const bodyComparison = await page.locator('body').textContent()
    expect(bodyComparison).toMatch(
      RegExp(`Comparison: ${testSet.firstSubmissionName} - ${testSet.secondSubmissionName}`)
    )
  })
}
