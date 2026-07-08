import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// Real public notebooks of the user dharmendrapandit12
const REAL_NOTEBOOKS = [
  {
    title: 'Laptop Battery Health Dataset Generation',
    description: 'Synthetic dataset generation with realistic battery degradation patterns (voltage, temperature, cycle count) and baseline machine learning modeling.',
    datasetName: 'Laptop Battery Health Prediction Dataset',
    tags: ['Python', 'Data Generation', 'Battery Health', 'Regression'],
    notebookUrl: 'https://www.kaggle.com/code/dharmendrapandit12/laptop-battery-health-dataset-generation',
    kaggleUrl: 'https://www.kaggle.com/code/dharmendrapandit12/laptop-battery-health-dataset-generation',
    type: 'notebook'
  },
  {
    title: 'Breast Cancer Predictions',
    description: 'Exploratory Data Analysis and machine learning models to predict breast cancer classifications using SVM, Random Forests, and XGBoost.',
    datasetName: 'Breast Cancer Dataset CSV',
    tags: ['Python', 'Pandas', 'Scikit-learn', 'Classification', 'EDA'],
    notebookUrl: 'https://www.kaggle.com/code/dharmendrapandit12/breast-cancer-predictions',
    kaggleUrl: 'https://www.kaggle.com/code/dharmendrapandit12/breast-cancer-predictions',
    type: 'notebook'
  }
]

export async function GET() {
  try {
    const username = process.env.KAGGLE_USERNAME || 'dharmendrapandit12'
    const apiKey = process.env.KAGGLE_KEY

    let rawDatasets: any[] = []
    let datasetsFetched = false

    // 1. Try fetching datasets using API key
    if (apiKey) {
      try {
        const auth = Buffer.from(`${username}:${apiKey}`).toString('base64')
        const res = await fetch(`https://www.kaggle.com/api/v1/datasets/list?user=${username}`, {
          headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/json'
          },
          cache: 'no-store'
        })
        if (res.ok) {
          rawDatasets = await res.json()
          datasetsFetched = true
        }
      } catch (err) {
        console.error('[Kaggle API] Authenticated datasets fetch failed:', err)
      }
    }

    // 2. If authenticated fetch failed or wasn't tried, fetch datasets publicly (which is supported)
    if (!datasetsFetched) {
      try {
        const res = await fetch(`https://www.kaggle.com/api/v1/datasets/list?user=${username}`, {
          cache: 'no-store'
        })
        if (res.ok) {
          rawDatasets = await res.json()
          datasetsFetched = true
        }
      } catch (err) {
        console.error('[Kaggle API] Public datasets fetch failed:', err)
      }
    }

    // Map datasets data
    let datasets: any[] = []
    if (datasetsFetched && Array.isArray(rawDatasets) && rawDatasets.length > 0) {
      datasets = rawDatasets.map((dataset: any) => {
        const date = new Date(dataset.lastUpdated)
        const lastUpdated = date.toLocaleDateString('en-US', {
          month: 'short',
          year: 'numeric'
        })

        let description = dataset.subtitle || dataset.description || 'Data science dataset hosted on Kaggle.'
        let tags = ['Dataset', 'CSV']

        if (dataset.ref.toLowerCase().includes('breast-cancer')) {
          description = 'Comprehensive CSV dataset containing clinical measurements and features optimized for breast cancer prediction and classification models.'
          tags = ['Classification', 'Healthcare', 'CSV', 'Tabular']
        } else if (dataset.ref.toLowerCase().includes('battery')) {
          description = 'Synthetic dataset with realistic battery degradation patterns (voltage, temperature, cycle count) for predicting cell state-of-health.'
          tags = ['Battery Health', 'Data Generation', 'Time Series', 'Regression']
        }

        return {
          title: dataset.title,
          description,
          datasetName: dataset.title,
          tags,
          lastUpdated,
          notebookUrl: dataset.url || `https://www.kaggle.com/datasets/${dataset.ref}`,
          kaggleUrl: dataset.url || `https://www.kaggle.com/datasets/${dataset.ref}`,
          type: 'dataset'
        }
      })
    } else {
      // Clean fallback if API request fails completely
      datasets = [
        {
          title: 'Laptop Battery Health Prediction Dataset',
          description: 'Synthetic dataset with realistic battery degradation patterns (voltage, temperature, cycle count) for predicting cell state-of-health.',
          datasetName: 'Laptop Battery Health Prediction Dataset',
          tags: ['Battery Health', 'Data Generation', 'Time Series', 'Regression'],
          lastUpdated: 'Jul 2026',
          notebookUrl: `https://www.kaggle.com/datasets/${username}/laptop-battery-health-dataset`,
          kaggleUrl: `https://www.kaggle.com/datasets/${username}/laptop-battery-health-dataset`,
          type: 'dataset'
        },
        {
          title: 'Breast Cancer Dataset CSV',
          description: 'Comprehensive CSV dataset containing clinical measurements and features optimized for breast cancer prediction and classification models.',
          datasetName: 'Breast Cancer Dataset CSV',
          tags: ['Classification', 'Healthcare', 'CSV', 'Tabular'],
          lastUpdated: 'Jun 2026',
          notebookUrl: `https://www.kaggle.com/datasets/${username}/breast-cancer-dataset-csv`,
          kaggleUrl: `https://www.kaggle.com/datasets/${username}/breast-cancer-dataset-csv`,
          type: 'dataset'
        }
      ]
    }

    // Resolve update dates for the notebooks from the dynamic datasets
    let laptopDate = 'Jul 2026'
    let cancerDate = 'Jun 2026'

    const laptopDb = datasets.find(d => d.notebookUrl.includes('laptop-battery-health-dataset'))
    if (laptopDb) {
      laptopDate = laptopDb.lastUpdated
    }
    const cancerDb = datasets.find(d => d.notebookUrl.includes('breast-cancer-dataset'))
    if (cancerDb) {
      cancerDate = cancerDb.lastUpdated
    }

    // Set notebooks list using accurate real data and dynamic dates
    const notebooks = REAL_NOTEBOOKS.map(nb => {
      let lastUpdated = 'Jul 2026'
      if (nb.notebookUrl.includes('laptop-battery-health')) {
        lastUpdated = laptopDate
      } else if (nb.notebookUrl.includes('breast-cancer')) {
        lastUpdated = cancerDate
      }
      return {
        ...nb,
        lastUpdated
      }
    })

    // Return the accurate profile metrics
    const profile = {
      tier: 'Novice',
      datasetCount: datasets.length,
      notebookCount: notebooks.length,
      followers: 0
    }

    return NextResponse.json({ notebooks, datasets, profile, username, link: `https://www.kaggle.com/${username}/` })
  } catch (error) {
    const username = process.env.KAGGLE_USERNAME || 'dharmendrapandit12'
    console.error('[Kaggle API] Error fetching Kaggle data:', error)
    return NextResponse.json({
      notebooks: REAL_NOTEBOOKS.map(nb => ({ ...nb, lastUpdated: 'Jul 2026' })),
      datasets: [
        {
          title: 'Laptop Battery Health Prediction Dataset',
          description: 'Synthetic dataset with realistic battery degradation patterns (voltage, temperature, cycle count) for predicting cell state-of-health.',
          datasetName: 'Laptop Battery Health Prediction Dataset',
          tags: ['Battery Health', 'Data Generation', 'Time Series', 'Regression'],
          lastUpdated: 'Jul 2026',
          notebookUrl: `https://www.kaggle.com/datasets/${username}/laptop-battery-health-dataset`,
          kaggleUrl: `https://www.kaggle.com/datasets/${username}/laptop-battery-health-dataset`,
          type: 'dataset'
        },
        {
          title: 'Breast Cancer Dataset CSV',
          description: 'Comprehensive CSV dataset containing clinical measurements and features optimized for breast cancer prediction and classification models.',
          datasetName: 'Breast Cancer Dataset CSV',
          tags: ['Classification', 'Healthcare', 'CSV', 'Tabular'],
          lastUpdated: 'Jun 2026',
          notebookUrl: `https://www.kaggle.com/datasets/${username}/breast-cancer-dataset-csv`,
          kaggleUrl: `https://www.kaggle.com/datasets/${username}/breast-cancer-dataset-csv`,
          type: 'dataset'
        }
      ],
      profile: {
        tier: 'Novice',
        datasetCount: 2,
        notebookCount: 2,
        followers: 0
      },
      username,
      link: `https://www.kaggle.com/u/${username}/`
    })
  }
}
