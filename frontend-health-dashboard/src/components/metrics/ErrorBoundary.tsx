"use client";

import { Component, ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <Card>
          <CardContent className="pt-6 text-center text-sm text-muted-foreground">
            Failed to load this widget. Other modules are unaffected.
          </CardContent>
        </Card>
      );
    }
    return this.props.children;
  }
}