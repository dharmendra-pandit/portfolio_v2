'use client'

import { motion } from 'framer-motion'
import { FaKaggle } from 'react-icons/fa'
import { KaggleCard, KaggleNotebook } from '../ui/kaggle-card'
import { Button } from '../ui/button'

const KAGGLE_NOTEBOOKS: KaggleNotebook[] = [
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

export const KaggleProjects = () => {
  return (
    <section
      id="kaggle"
      className="relative py-48 flex items-center justify-center overflow-hidden"
    >
      {/* Decorative background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#20BEFF]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container px-4 mx-auto relative z-10">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-foreground/5 border border-border text-sm mb-6 shadow-[0_0_15px_rgba(255,255,255,0.05)] text-[#20BEFF]"
          >
            <FaKaggle className="w-4 h-4" />
            <span>Kaggle Code</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tighter mb-6 text-foreground"
          >
            Kaggle <span className="text-foreground/80">Notebooks.</span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl mx-auto text-lg text-muted-foreground"
          >
            A curated showcase of my data science projects, predictive modeling, and exploratory analyses on Kaggle.
          </motion.p>
        </div>

        {/* Responsive Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto mb-16">
          {KAGGLE_NOTEBOOKS.map((notebook, index) => (
            <KaggleCard key={notebook.title} notebook={notebook} index={index} />
          ))}
        </div>

        {/* View All Kaggle Work Link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-center"
        >
          <a
            href="https://www.kaggle.com/work"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block"
          >
            <Button
              variant="outline"
              size="lg"
              className="px-8 py-6 rounded-2xl border-border bg-background hover:bg-muted dark:border-input dark:bg-input/30 dark:hover:bg-input/50 transition-all font-semibold gap-2 shadow-[0_4px_20px_rgba(32,190,255,0.05)] cursor-pointer text-sm"
            >
              <FaKaggle className="w-5 h-5 text-[#20BEFF]" />
              <span>View All Kaggle Work</span>
            </Button>
          </a>
        </motion.div>
      </div>
    </section>
  )
}
