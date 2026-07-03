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

export async function GET() {
  try {
    const username = process.env.KAGGLE_USERNAME || 'dharmendrapandit12'
    const apiKey = process.env.KAGGLE_KEY

    // If API credentials are not set, return fallback notebooks list
    if (!apiKey) {
      console.warn('[Kaggle API] KAGGLE_KEY not found in environment variables. Returning fallback notebooks.')
      return NextResponse.json({ projects: DEFAULT_NOTEBOOKS })
    }

    const auth = Buffer.from(`${username}:${apiKey}`).toString('base64')
    
    // Fetch user's kernels from Kaggle REST API
    const response = await fetch(`https://www.kaggle.com/api/v1/kernels/list?user=${username}`, {
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json'
      },
      next: { revalidate: 3600 } // Cache for 1 hour
    })

    if (!response.ok) {
      console.error(`[Kaggle API] API call failed with status: ${response.status}. Returning fallback.`)
      return NextResponse.json({ projects: DEFAULT_NOTEBOOKS })
    }

    const kernels = await response.json()
    
    if (!Array.isArray(kernels) || kernels.length === 0) {
      return NextResponse.json({ projects: DEFAULT_NOTEBOOKS })
    }

    // Map Kaggle kernels API response to Project items
    const projects = kernels.map((kernel: any) => {
      const slug = kernel.ref.split('/')[1]
      
      // Determine description, dataset, and tags based on name / slug
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

      // Format date
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

    return NextResponse.json({ projects })
  } catch (error) {
    console.error('[Kaggle API] Error fetching kernels:', error)
    return NextResponse.json({ projects: DEFAULT_NOTEBOOKS })
  }
}
