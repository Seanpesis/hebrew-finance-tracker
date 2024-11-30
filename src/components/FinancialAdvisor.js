import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Chip,
  Collapse,
  IconButton,
  Alert,
  Tooltip
} from '@mui/material';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';

const FinancialAdvisor = ({ expenses, income, goals }) => {
  const [expanded, setExpanded] = useState(true);
  const [tips, setTips] = useState([]);
  const [alerts, setAlerts] = useState([]);

  const analyzeFinances = () => {
    const newTips = [];
    const newAlerts = [];

    // חישוב סטטיסטיקות בסיסיות
    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const monthlySavings = income - totalExpenses;
    const savingsRate = (monthlySavings / income) * 100;

    // ניתוח קטגוריות הוצאות
    const categoryTotals = expenses.reduce((acc, exp) => {
      acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
      return acc;
    }, {});

    // בדיקת יחס חיסכון
    if (savingsRate < 20) {
      newAlerts.push({
        severity: 'warning',
        message: 'שיעור החיסכון שלך נמוך מהמומלץ (20%). שקול להגדיל את החיסכון החודשי.'
      });
    } else if (savingsRate >= 30) {
      newTips.push({
        icon: <TrendingUpIcon color="success" />,
        text: 'כל הכבוד! אתה חוסך באופן מרשים. שקול להשקיע חלק מהחסכונות לטווח ארוך.'
      });
    }

    // בדיקת קטגוריות בזבזניות
    Object.entries(categoryTotals).forEach(([category, total]) => {
      const categoryPercentage = (total / totalExpenses) * 100;
      if (categoryPercentage > 40) {
        newAlerts.push({
          severity: 'warning',
          message: `${category} מהווה ${categoryPercentage.toFixed(1)}% מההוצאות שלך. שקול לצמצם הוצאות בקטגוריה זו.`
        });
      }
    });

    // טיפים מותאמים אישית
    if (expenses.length > 0) {
      const mostExpensiveCategory = Object.entries(categoryTotals)
        .sort(([,a], [,b]) => b - a)[0][0];
      
      newTips.push({
        icon: <LightbulbIcon color="primary" />,
        text: `זיהינו שההוצאה הגדולה ביותר שלך היא ב${mostExpensiveCategory}. הנה כמה טיפים לחיסכון בקטגוריה זו:`
      });

      // טיפים ספציפיים לקטגוריות
      switch (mostExpensiveCategory) {
        case 'מזון':
          newTips.push({
            icon: <TipsAndUpdatesIcon />,
            text: 'תכנן את הקניות מראש, השתמש ברשימת קניות, ונצל מבצעים על מוצרים שאתה צורך באופן קבוע.'
          });
          break;
        case 'בידור':
          newTips.push({
            icon: <TipsAndUpdatesIcon />,
            text: 'חפש אלטרנטיבות חינמיות או מוזלות לבילויים, כמו אירועי תרבות מסובסדים או פעילויות בטבע.'
          });
          break;
        case 'תחבורה':
          newTips.push({
            icon: <TipsAndUpdatesIcon />,
            text: 'שקול שימוש בתחבורה ציבורית או שיתוף נסיעות לחיסכון בדלק וחניה.'
          });
          break;
        default:
          newTips.push({
            icon: <TipsAndUpdatesIcon />,
            text: 'נסה לזהות דפוסי הוצאות חוזרים ובחן האם ניתן לצמצם או למצוא אלטרנטיבות זולות יותר.'
          });
      }
    }

    // בדיקת יעדים
    if (goals && goals.length > 0) {
      goals.forEach(goal => {
        const monthsRemaining = Math.ceil(
          (new Date(goal.deadline) - new Date()) / (1000 * 60 * 60 * 24 * 30)
        );
        const requiredMonthlySaving = (goal.targetAmount - goal.currentAmount) / monthsRemaining;

        if (requiredMonthlySaving > monthlySavings) {
          newAlerts.push({
            severity: 'warning',
            message: `כדי להשיג את היעד "${goal.name}", עליך לחסוך ${requiredMonthlySaving.toFixed(0)} ₪ בחודש. זה יותר מהחיסכון הנוכחי שלך.`
          });
        }
      });
    }

    setTips(newTips);
    setAlerts(newAlerts);
  };

  useEffect(() => {
    analyzeFinances();
  }, [expenses, income, goals]);

  return (
    <Card 
      sx={{ 
        mb: 3,
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6" component="div" sx={{ display: 'flex', alignItems: 'center' }}>
            <TipsAndUpdatesIcon sx={{ mr: 1 }} /> יועץ פיננסי חכם
          </Typography>
          <Tooltip title={expanded ? "צמצם" : "הרחב"}>
            <IconButton
              onClick={() => setExpanded(!expanded)}
              sx={{
                transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.3s'
              }}
            >
              <ExpandMoreIcon />
            </IconButton>
          </Tooltip>
        </Box>

        <Collapse in={expanded}>
          {alerts.map((alert, index) => (
            <Alert 
              key={index} 
              severity={alert.severity}
              sx={{ mb: 2 }}
              icon={<WarningIcon />}
            >
              {alert.message}
            </Alert>
          ))}

          <Divider sx={{ my: 2 }} />

          <List>
            {tips.map((tip, index) => (
              <ListItem key={index}>
                <ListItemIcon>
                  {tip.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={tip.text}
                  sx={{
                    '& .MuiListItemText-primary': {
                      fontSize: '0.95rem',
                      lineHeight: 1.5
                    }
                  }}
                />
              </ListItem>
            ))}
          </List>
        </Collapse>
      </CardContent>
    </Card>
  );
};

export default FinancialAdvisor;
