'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Brain, CheckCircle2, AlertCircle, XCircle, ChevronRight, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { FadeIn } from '@/components/animations';
import { cn } from '@/lib/utils';

interface Question {
  id: string;
  category: string;
  text: string;
  options: {
    label: string;
    value: number;
  }[];
}

const questions: Question[] = [
  // Data Readiness
  {
    id: 'data-quality',
    category: 'Data',
    text: 'How would you rate your data quality and accessibility?',
    options: [
      { label: 'Poor - Data is scattered and unreliable', value: 1 },
      { label: 'Fair - Some data is accessible but inconsistent', value: 2 },
      { label: 'Good - Most data is accessible and fairly reliable', value: 3 },
      { label: 'Excellent - High-quality data is readily accessible', value: 4 },
    ],
  },
  {
    id: 'data-volume',
    category: 'Data',
    text: 'Do you have sufficient data volume for AI training?',
    options: [
      { label: 'Very limited data available', value: 1 },
      { label: 'Some data but may not be enough', value: 2 },
      { label: 'Good amount of historical data', value: 3 },
      { label: 'Extensive data with good variety', value: 4 },
    ],
  },
  {
    id: 'data-governance',
    category: 'Data',
    text: 'How mature is your data governance?',
    options: [
      { label: 'No formal governance', value: 1 },
      { label: 'Basic policies exist but not enforced', value: 2 },
      { label: 'Established governance with some automation', value: 3 },
      { label: 'Mature, automated data governance', value: 4 },
    ],
  },
  // Technology
  {
    id: 'infrastructure',
    category: 'Technology',
    text: 'How would you rate your current IT infrastructure?',
    options: [
      { label: 'Legacy systems, difficult to integrate', value: 1 },
      { label: 'Mixed environment with some modern systems', value: 2 },
      { label: 'Modern infrastructure with API capabilities', value: 3 },
      { label: 'Cloud-native, highly scalable architecture', value: 4 },
    ],
  },
  {
    id: 'integration',
    category: 'Technology',
    text: 'How easy is it to integrate new systems?',
    options: [
      { label: 'Very difficult, requires extensive custom work', value: 1 },
      { label: 'Challenging but possible with effort', value: 2 },
      { label: 'Moderately easy with standard APIs', value: 3 },
      { label: 'Very easy with modern integration tools', value: 4 },
    ],
  },
  {
    id: 'security',
    category: 'Technology',
    text: 'How mature is your cybersecurity posture?',
    options: [
      { label: 'Basic security measures only', value: 1 },
      { label: 'Some security policies in place', value: 2 },
      { label: 'Comprehensive security program', value: 3 },
      { label: 'Advanced security with AI/ML capabilities', value: 4 },
    ],
  },
  // People & Skills
  {
    id: 'ai-talent',
    category: 'People',
    text: 'Do you have access to AI/ML talent?',
    options: [
      { label: 'No AI expertise in-house or planned', value: 1 },
      { label: 'Limited understanding, considering training', value: 2 },
      { label: 'Some team members with AI knowledge', value: 3 },
      { label: 'Strong AI team or reliable partners', value: 4 },
    ],
  },
  {
    id: 'data-literacy',
    category: 'People',
    text: 'How data-literate is your workforce?',
    options: [
      { label: 'Low - Most avoid data-driven decisions', value: 1 },
      { label: 'Fair - Some departments use data regularly', value: 2 },
      { label: 'Good - Data is commonly used across teams', value: 3 },
      { label: 'High - Data-driven culture throughout', value: 4 },
    ],
  },
  {
    id: 'change-readiness',
    category: 'People',
    text: 'How receptive is your organization to change?',
    options: [
      { label: 'Resistant to new technologies', value: 1 },
      { label: 'Cautious but open with proof', value: 2 },
      { label: 'Generally open to innovation', value: 3 },
      { label: 'Early adopters, embrace innovation', value: 4 },
    ],
  },
  // Strategy
  {
    id: 'leadership-support',
    category: 'Strategy',
    text: 'What is the level of leadership support for AI?',
    options: [
      { label: 'No executive interest or awareness', value: 1 },
      { label: 'Some curiosity but no commitment', value: 2 },
      { label: 'Active interest and resource allocation', value: 3 },
      { label: 'Strong executive sponsorship with budget', value: 4 },
    ],
  },
  {
    id: 'use-case-clarity',
    category: 'Strategy',
    text: 'How clear are your AI use cases?',
    options: [
      { label: 'No identified use cases', value: 1 },
      { label: 'Some vague ideas but not defined', value: 2 },
      { label: 'Clear use cases identified', value: 3 },
      { label: 'Well-defined use cases with ROI estimates', value: 4 },
    ],
  },
  {
    id: 'business-alignment',
    category: 'Strategy',
    text: 'How aligned are AI initiatives with business goals?',
    options: [
      { label: 'No connection to business strategy', value: 1 },
      { label: 'Weak alignment, mostly experimental', value: 2 },
      { label: 'Moderate alignment with some strategic goals', value: 3 },
      { label: 'Strong alignment with core business objectives', value: 4 },
    ],
  },
];

export function AIReadinessScoreClient() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);

  const handleAnswer = (value: number) => {
    const newAnswers = { ...answers, [questions[currentQuestion].id]: value };
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const handleReset = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
  };

  const calculateScores = () => {
    const categories = ['Data', 'Technology', 'People', 'Strategy'];
    const categoryScores: Record<string, number> = {};
    
    categories.forEach(category => {
      const categoryQuestions = questions.filter(q => q.category === category);
      const totalScore = categoryQuestions.reduce((sum, q) => sum + (answers[q.id] || 0), 0);
      const maxScore = categoryQuestions.length * 4;
      categoryScores[category] = Math.round((totalScore / maxScore) * 100);
    });

    const overallScore = Math.round(
      Object.values(categoryScores).reduce((sum, score) => sum + score, 0) / categories.length
    );

    return { overallScore, categoryScores };
  };

  const getReadinessLevel = (score: number) => {
    if (score >= 75) return { label: 'Ready', color: 'text-green-500', bg: 'bg-green-500', icon: CheckCircle2 };
    if (score >= 50) return { label: 'Getting Ready', color: 'text-amber-500', bg: 'bg-amber-500', icon: AlertCircle };
    return { label: 'Needs Work', color: 'text-red-500', bg: 'bg-red-500', icon: XCircle };
  };

  const getRecommendation = (category: string, score: number) => {
    if (score >= 75) return `Your ${category.toLowerCase()} foundation is strong. Focus on optimization and scaling.`;
    if (score >= 50) return `Your ${category.toLowerCase()} readiness is developing. Address gaps before major AI investments.`;
    return `Significant ${category.toLowerCase()} improvements needed. Prioritize foundational work.`;
  };

  if (showResults) {
    const { overallScore, categoryScores } = calculateScores();
    const readiness = getReadinessLevel(overallScore);
    const Icon = readiness.icon;

    return (
      <div className="min-h-screen bg-background pb-20">
        {/* Navigation */}
        <div className="border-b border-border/50">
          <div className="container py-4">
            <Link 
              href="/solutions/resources"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Resources
            </Link>
          </div>
        </div>

        <section className="py-12 lg:py-20">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <FadeIn>
                <div className="text-center mb-12">
                  <h1 className="text-4xl md:text-5xl font-bold mb-6">
                    Your AI Readiness Score
                  </h1>
                  
                  {/* Overall Score */}
                  <div className="inline-flex flex-col items-center">
                    <div className={cn("w-32 h-32 rounded-full flex items-center justify-center mb-4", readiness.bg.replace('bg-', 'bg-opacity-10 bg-'))}>
                      <Icon className={cn("w-16 h-16", readiness.color)} />
                    </div>
                    <p className={cn("text-6xl font-bold mb-2", readiness.color)}>
                      {overallScore}%
                    </p>
                    <Badge variant="outline" className={cn("text-lg px-4 py-1", readiness.color)}>
                      {readiness.label}
                    </Badge>
                  </div>
                </div>
              </FadeIn>

              {/* Category Breakdown */}
              <FadeIn delay={0.1}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                  {Object.entries(categoryScores).map(([category, score]) => {
                    const catReadiness = getReadinessLevel(score);
                    return (
                      <Card key={category}>
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold">{category}</h3>
                            <span className={cn("font-bold", catReadiness.color)}>
                              {score}%
                            </span>
                          </div>
                          <Progress value={score} className="mb-4" />
                          <p className="text-sm text-muted-foreground">
                            {getRecommendation(category, score)}
                          </p>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </FadeIn>

              {/* Actions */}
              <FadeIn delay={0.2}>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button variant="outline" onClick={handleReset} className="gap-2">
                    <RefreshCcw className="w-4 h-4" />
                    Retake Assessment
                  </Button>
                  <Button className="bg-amber-500 hover:bg-amber-600 gap-2" asChild>
                    <Link href="/contact">
                      Schedule a Consultation
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </Button>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Navigation */}
      <div className="border-b border-border/50">
        <div className="container py-4">
          <Link 
            href="/solutions/resources"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Resources
          </Link>
        </div>
      </div>

      <section className="py-12 lg:py-20">
        <div className="container">
          <div className="max-w-2xl mx-auto">
            <FadeIn>
              {/* Header */}
              <div className="text-center mb-12">
                <Badge variant="outline" className="mb-4 px-3 py-1 border-amber-500/30 text-amber-500">
                  Interactive Assessment
                </Badge>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                  AI Readiness Score
                </h1>
                <p className="text-lg text-muted-foreground">
                  Assess your organization's readiness for AI adoption across 
                  four key dimensions: Data, Technology, People, and Strategy.
                </p>
              </div>

              {/* Progress */}
              <div className="mb-8">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-muted-foreground">
                    Question {currentQuestion + 1} of {questions.length}
                  </span>
                  <span className="text-amber-500 font-medium">
                    {Math.round(progress)}% Complete
                  </span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>

              {/* Question Card */}
              <Card>
                <CardContent className="p-6 md:p-8">
                  <Badge variant="secondary" className="mb-4">
                    <Brain className="w-3 h-3 mr-1" />
                    {question.category}
                  </Badge>
                  
                  <h2 className="text-xl md:text-2xl font-semibold mb-8">
                    {question.text}
                  </h2>

                  <div className="space-y-3">
                    {question.options.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => handleAnswer(option.value)}
                        className={cn(
                          "w-full text-left p-4 rounded-lg border-2 transition-all duration-200",
                          "hover:border-amber-500/50 hover:bg-amber-500/5",
                          "focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded-full border-2 border-border flex items-center justify-center flex-shrink-0">
                            <div className="w-3 h-3 rounded-full bg-amber-500 opacity-0 transition-opacity" />
                          </div>
                          <span className="font-medium">{option.label}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </FadeIn>
          </div>
        </div>
      </section>
    </div>
  );
}
