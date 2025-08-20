/**
 * Apple Design System Showcase
 * Demonstrates all Apple HIG compliant components with proper spacing and golden ratio proportions
 */

import React, { memo, useState } from 'react';
import AppleHeader from '../ui/AppleHeader';
import AppleButton, { PrimaryButton, SecondaryButton, IconButton, FloatingActionButton } from '../ui/AppleButton';
import AppleCard, { ArticleCard, StatsCard, CardHeader, CardContent, CardFooter } from '../ui/AppleCard';
import AppleInput, { AppleSearchInput, AppleSelect, AppleTextarea } from '../ui/AppleInput';
import AppleMobileNav, { NavIcons } from '../ui/AppleMobileNav';
import { Container, Stack, Grid, Section, SafeArea, Divider, AspectRatio } from '../ui/AppleLayout';
import LoadingSpinner from '../ui/LoadingSpinner';
import ErrorMessage from '../ui/ErrorMessage';

type Category = 'official' | 'intelligence' | 'data';

const AppleDesignShowcase: React.FC = memo(() => {
  const [activeCategory, setActiveCategory] = useState<Category>('official');
  const [activeNavItem, setActiveNavItem] = useState('home');
  const [searchValue, setSearchValue] = useState('');
  const [selectValue, setSelectValue] = useState('');

  // Mock data
  const navItems = [
    { id: 'home', label: 'Home', icon: NavIcons.Home },
    { id: 'search', label: 'Search', icon: NavIcons.Search, badge: 3 },
    { id: 'bookmarks', label: 'Saved', icon: NavIcons.Bookmark },
    { id: 'profile', label: 'Profile', icon: NavIcons.Profile },
    { id: 'settings', label: 'Settings', icon: NavIcons.Settings }
  ];

  const selectOptions = [
    { value: 'turkey', label: 'Turkey' },
    { value: 'usa', label: 'United States' },
    { value: 'uk', label: 'United Kingdom' },
    { value: 'germany', label: 'Germany' }
  ];

  const mockArticles = [
    {
      title: 'Economic Policy Updates from Central Bank',
      summary: 'The central bank announced new monetary policy measures to address inflation concerns and support economic growth in the coming quarter.',
      date: '2 hours ago',
      source: 'Central Bank',
      topics: ['Economy', 'Policy', 'Finance'],
      bookmarked: false
    },
    {
      title: 'Infrastructure Development Initiative Launched',
      summary: 'A comprehensive infrastructure development program has been announced, focusing on transportation, energy, and digital connectivity improvements.',
      date: '4 hours ago',
      source: 'Ministry of Development',
      topics: ['Infrastructure', 'Development', 'Technology'],
      bookmarked: true
    }
  ];

  return (
    <SafeArea className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <AppleHeader
        onNavigateBack={() => console.log('Navigate back')}
        activeCategory={activeCategory}
        onSetCategory={setActiveCategory}
      />

      {/* Main Content */}
      <Container size="xl" padding="md" className="pb-20">
        <Stack direction="vertical" spacing="xl">
          
          {/* Hero Section */}
          <Section 
            title="Apple Design System" 
            subtitle="A comprehensive showcase of Apple HIG compliant components with golden ratio proportions"
          >
            <AspectRatio ratio={2.618} className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl overflow-hidden">
              <div className="flex items-center justify-center text-white">
                <Stack direction="vertical" spacing="md" align="center">
                  <h1 className="text-4xl font-bold">TheGovNews</h1>
                  <p className="text-xl opacity-90">Beautiful. Functional. Accessible.</p>
                  <PrimaryButton size="lg">
                    Get Started
                  </PrimaryButton>
                </Stack>
              </div>
            </AspectRatio>
          </Section>

          {/* Stats Grid */}
          <Section title="Key Metrics">
            <Grid columns={4} spacing="md">
              <StatsCard
                title="Total Articles"
                value="12,847"
                change="+12% this month"
                trend="up"
                icon={
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2"/>
                    <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                }
              />
              <StatsCard
                title="Active Sources"
                value="247"
                change="+5 new sources"
                trend="up"
                icon={
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                    <polyline points="12,6 12,12 16,14" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                }
              />
              <StatsCard
                title="Countries Covered"
                value="89"
                change="Global coverage"
                trend="neutral"
                icon={
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                    <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                }
              />
              <StatsCard
                title="User Engagement"
                value="94.2%"
                change="+2.1% this week"
                trend="up"
                icon={
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                }
              />
            </Grid>
          </Section>

          {/* Form Components */}
          <Section title="Interactive Components">
            <AppleCard variant="glass" size="lg">
              <CardHeader title="Search and Filters" />
              <CardContent>
                <Stack direction="vertical" spacing="lg">
                  <Grid columns={2} spacing="md">
                    <AppleSearchInput
                      label="Search Articles"
                      placeholder="Search for news, topics, or sources..."
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                      fullWidth
                    />
                    <AppleSelect
                      label="Select Country"
                      placeholder="Choose a country..."
                      options={selectOptions}
                      value={selectValue}
                      onChange={setSelectValue}
                      fullWidth
                    />
                  </Grid>
                  
                  <AppleTextarea
                    label="Additional Notes"
                    placeholder="Add any additional search criteria or notes..."
                    rows={3}
                    fullWidth
                  />
                  
                  <Stack direction="horizontal" spacing="md" justify="end">
                    <SecondaryButton>Reset</SecondaryButton>
                    <PrimaryButton>Apply Filters</PrimaryButton>
                  </Stack>
                </Stack>
              </CardContent>
            </AppleCard>
          </Section>

          {/* Button Showcase */}
          <Section title="Button Variants">
            <AppleCard variant="outlined" size="md">
              <CardContent>
                <Stack direction="vertical" spacing="lg">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Primary Actions</h4>
                    <Stack direction="horizontal" spacing="md" wrap>
                      <PrimaryButton size="sm">Small</PrimaryButton>
                      <PrimaryButton size="md">Medium</PrimaryButton>
                      <PrimaryButton size="lg">Large</PrimaryButton>
                      <PrimaryButton size="xl">Extra Large</PrimaryButton>
                    </Stack>
                  </div>
                  
                  <Divider />
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Secondary Actions</h4>
                    <Stack direction="horizontal" spacing="md" wrap>
                      <SecondaryButton>Cancel</SecondaryButton>
                      <AppleButton variant="tertiary">Learn More</AppleButton>
                      <AppleButton variant="destructive">Delete</AppleButton>
                      <AppleButton variant="ghost">Skip</AppleButton>
                    </Stack>
                  </div>
                  
                  <Divider />
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Special Buttons</h4>
                    <Stack direction="horizontal" spacing="md" wrap>
                      <IconButton 
                        icon={NavIcons.Search} 
                        aria-label="Search"
                        variant="secondary"
                      />
                      <AppleButton loading>Loading...</AppleButton>
                      <FloatingActionButton>
                        Create New
                      </FloatingActionButton>
                    </Stack>
                  </div>
                </Stack>
              </CardContent>
            </AppleCard>
          </Section>

          {/* Article Cards */}
          <Section title="Recent Articles">
            <Grid columns="auto" spacing="md" minItemWidth={400}>
              {mockArticles.map((article, index) => (
                <ArticleCard
                  key={index}
                  title={article.title}
                  summary={article.summary}
                  date={article.date}
                  source={article.source}
                  topics={article.topics}
                  bookmarked={article.bookmarked}
                  onBookmark={() => console.log('Toggle bookmark')}
                  onClick={() => console.log('Open article')}
                />
              ))}
            </Grid>
          </Section>

          {/* Loading and Error States */}
          <Section title="States and Feedback">
            <Grid columns={3} spacing="md">
              <AppleCard variant="filled" size="md">
                <CardHeader title="Loading State" />
                <CardContent>
                  <Stack direction="vertical" spacing="md" align="center">
                    <LoadingSpinner size="lg" message="Loading content..." />
                  </Stack>
                </CardContent>
              </AppleCard>
              
              <AppleCard variant="filled" size="md">
                <CardHeader title="Error State" />
                <CardContent>
                  <ErrorMessage
                    title="Connection Error"
                    message="Unable to load data. Please check your connection."
                    type="error"
                    onRetry={() => console.log('Retry')}
                  />
                </CardContent>
              </AppleCard>
              
              <AppleCard variant="filled" size="md">
                <CardHeader title="Success State" />
                <CardContent>
                  <ErrorMessage
                    title="Success!"
                    message="Your changes have been saved successfully."
                    type="info"
                  />
                </CardContent>
              </AppleCard>
            </Grid>
          </Section>

        </Stack>
      </Container>

      {/* Mobile Navigation */}
      <AppleMobileNav
        items={navItems}
        activeItem={activeNavItem}
        onItemSelect={setActiveNavItem}
      />
    </SafeArea>
  );
});

AppleDesignShowcase.displayName = 'AppleDesignShowcase';

export default AppleDesignShowcase;