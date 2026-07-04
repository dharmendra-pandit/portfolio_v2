import { NextResponse } from 'next/server'

const DEFAULT_NOTEBOOKS = [
  {
    title: 'House Prices Prediction',
    description: 'Advanced regression modeling to predict house prices using XGBoost, LightGBM, feature engineering, and robust ensembling techniques.',
    datasetName: 'House Prices - Advanced Regression Techniques',
    tags: ['Python', 'Pandas', 'Scikit-learn', 'EDA', 'Machine Learning'],
    lastUpdated: 'Mar 2026',
    notebookUrl: 'https://www.kaggle.com/code/dharmendrapandit12/house-prices-prediction',
    kaggleUrl: 'https://www.kaggle.com/code/dharmendrapandit12/house-prices-prediction'
  },
  {
    title: 'Titanic Survival Exploration',
    description: 'Extensive exploratory data analysis and feature engineering on passenger demographics to predict survival outcomes with Random Forests and SVMs.',
    datasetName: 'Titanic - Machine Learning from Disaster',
    tags: ['Python', 'Pandas', 'Scikit-learn', 'EDA', 'Machine Learning'],
    lastUpdated: 'Apr 2026',
    notebookUrl: 'https://www.kaggle.com/code/dharmendrapandit12/titanic-survival-exploration',
    kaggleUrl: 'https://www.kaggle.com/code/dharmendrapandit12/titanic-survival-exploration'
  },
  {
    title: 'Store Sales Forecasting',
    description: 'Time-series forecasting for grocery store sales using hybrid linear regression + XGBoost models, seasonality, and lag features.',
    datasetName: 'Store Sales - Time Series Forecasting',
    tags: ['Python', 'Pandas', 'Scikit-learn', 'EDA', 'Machine Learning'],
    lastUpdated: 'May 2026',
    notebookUrl: 'https://www.kaggle.com/code/dharmendrapandit12/store-sales-forecasting',
    kaggleUrl: 'https://www.kaggle.com/code/dharmendrapandit12/store-sales-forecasting'
  }
]

const DEFAULT_DATASETS = [
  {
    title: 'Indian E-commerce Sales Dataset',
    description: 'Comprehensive transaction history, customer demographics, and product category sales metrics across major Indian states for market research.',
    datasetName: 'Indian E-commerce Transactions',
    tags: ['E-commerce', 'Data Analytics', 'India', 'SQL', 'Pandas'],
    lastUpdated: 'Apr 2026',
    notebookUrl: 'https://www.kaggle.com/datasets/dharmendrapandit12/indian-ecommerce-sales-dataset',
    kaggleUrl: 'https://www.kaggle.com/datasets/dharmendrapandit12/indian-ecommerce-sales-dataset'
  },
  {
    title: 'Customer Churn Analysis Data',
    description: 'Customer profiles, service usage duration, billing preferences, and retention labels optimized for churn classification and predictive modeling.',
    datasetName: 'Telecom Customer Churn',
    tags: ['Classification', 'Machine Learning', 'Customer Retention'],
    lastUpdated: 'May 2026',
    notebookUrl: 'https://www.kaggle.com/datasets/dharmendrapandit12/customer-churn-analysis-data',
    kaggleUrl: 'https://www.kaggle.com/datasets/dharmendrapandit12/customer-churn-analysis-data'
  },
  {
    title: 'Crop Yield and Weather Dataset',
    description: 'Historical agricultural yields correlated with rainfall, temperature variations, and fertilizer metrics for predicting crop harvests.',
    datasetName: 'Agriculture Crop Yields',
    tags: ['Agriculture', 'Regression', 'Time Series', 'Weather'],
    lastUpdated: 'Jun 2026',
    notebookUrl: 'https://www.kaggle.com/datasets/dharmendrapandit12/crop-yield-and-weather-dataset',
    kaggleUrl: 'https://www.kaggle.com/datasets/dharmendrapandit12/crop-yield-and-weather-dataset'
  }
]

export async function GET() {
  try {
    const username = process.env.KAGGLE_USERNAME || 'dharmendrapandit12'
    const apiKey = process.env.KAGGLE_KEY

    // If API credentials are not set, return fallback notebooks and datasets list
    if (!apiKey) {
      console.warn('[Kaggle API] KAGGLE_KEY not found in environment variables. Returning fallback data.')
      return NextResponse.json({ 
        notebooks: DEFAULT_NOTEBOOKS,
        datasets: DEFAULT_DATASETS
      })
    }

    const auth = Buffer.from(`${username}:${apiKey}`).toString('base64')

    // Fetch user's kernels and datasets in parallel from Kaggle REST API
    const [kernelsRes, datasetsRes] = await Promise.all([
      fetch(`https://www.kaggle.com/api/v1/kernels/list?user=${username}`, {
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json'
        },
        next: { revalidate: 3600 } // Cache for 1 hour
      }).catch(err => {
        console.error('[Kaggle API] Error fetching kernels:', err)
        return null
      }),
      fetch(`https://www.kaggle.com/api/v1/datasets/list?user=${username}`, {
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json'
        },
        next: { revalidate: 3600 } // Cache for 1 hour
      }).catch(err => {
        console.error('[Kaggle API] Error fetching datasets:', err)
        return null
      })
    ])

    // Map Kaggle kernels API response to Notebook items
    let notebooks = DEFAULT_NOTEBOOKS
    if (kernelsRes && kernelsRes.ok) {
      const kernels = await kernelsRes.json()
      if (Array.isArray(kernels) && kernels.length > 0) {
        notebooks = kernels.map((kernel: any) => {
          const slug = kernel.ref.split('/')[1]
          let description = 'Machine learning model and data analysis built on Kaggle.'
          let datasetName = 'Kaggle Dataset'
          let tags = ['Python', 'Machine Learning']

          const lowerSlug = slug.toLowerCase()
          if (lowerSlug.includes('house-price') || lowerSlug.includes('housing')) {
            description = 'Advanced regression modeling to predict house prices using XGBoost, LightGBM, feature engineering, and robust ensembling techniques.'
            datasetName = 'House Prices - Advanced Regression Techniques'
            tags = ['Python', 'Pandas', 'Scikit-learn', 'EDA', 'Machine Learning']
          } else if (lowerSlug.includes('titanic') || lowerSlug.includes('survival')) {
            description = 'Extensive exploratory data analysis and feature engineering on passenger demographics to predict survival outcomes with Random Forests and SVMs.'
            datasetName = 'Titanic - Machine Learning from Disaster'
            tags = ['Python', 'Pandas', 'Scikit-learn', 'EDA', 'Machine Learning']
          } else if (lowerSlug.includes('sale') || lowerSlug.includes('forecast') || lowerSlug.includes('time-series')) {
            description = 'Time-series forecasting for grocery store sales using hybrid linear regression + XGBoost models, seasonality, and lag features.'
            datasetName = 'Store Sales - Time Series Forecasting'
            tags = ['Python', 'Pandas', 'Scikit-learn', 'EDA', 'Machine Learning']
          } else if (lowerSlug.includes('eda') || lowerSlug.includes('analysis')) {
            description = 'Comprehensive Exploratory Data Analysis (EDA) of tabular/image data to discover underlying patterns, anomalies, and feature correlations.'
            tags = ['Python', 'Pandas', 'EDA', 'Data Visualization']
          }

          const date = new Date(kernel.lastRunTime)
          const lastUpdated = date.toLocaleDateString('en-US', {
            month: 'short',
            year: 'numeric'
          })

          return {
            title: kernel.title,
            description,
            datasetName,
            tags,
            lastUpdated,
            notebookUrl: `https://www.kaggle.com/code/${kernel.ref}`,
            kaggleUrl: `https://www.kaggle.com/code/${kernel.ref}`
          }
        })
      }
    }

    // Map Kaggle datasets API response to Dataset items
    let datasets = DEFAULT_DATASETS
    if (datasetsRes && datasetsRes.ok) {
      const kaggleDatasets = await datasetsRes.json()
      if (Array.isArray(kaggleDatasets) && kaggleDatasets.length > 0) {
        datasets = kaggleDatasets.map((dataset: any) => {
          const slug = dataset.ref.split('/')[1]
          let description = dataset.description || 'Data science dataset hosted on Kaggle.'
          let tags = dataset.tags?.map((t: any) => typeof t === 'string' ? t : t.name) || ['Python', 'Dataset']

          const date = new Date(dataset.lastUpdated)
          const lastUpdated = date.toLocaleDateString('en-US', {
            month: 'short',
            year: 'numeric'
          })

          return {
            title: dataset.title,
            description,
            datasetName: dataset.title,
            tags: tags.slice(0, 5),
            lastUpdated,
            notebookUrl: `https://www.kaggle.com/datasets/${dataset.ref}`,
            kaggleUrl: `https://www.kaggle.com/datasets/${dataset.ref}`
          }
        })
      }
    }

    return NextResponse.json({ notebooks, datasets })
  } catch (error) {
    console.error('[Kaggle API] Error fetching Kaggle data:', error)
    return NextResponse.json({ 
      notebooks: DEFAULT_NOTEBOOKS,
      datasets: DEFAULT_DATASETS
    })
  }
}
