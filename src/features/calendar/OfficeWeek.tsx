import { Component } from 'solid-js';
import { Card, CardHeader, CardTitle, CardContent } from '~/components/ui/card';

export const OfficeWeek: Component = () => {
  return (
    <div class="flex items-start lg:items-center lg:m-8 sm:m-4 m-2 w-full">
      <div class="flex flex-col lg:flex-row items-stretch justify-center gap-8 flex-wrap w-full">
        <Card class="flex flex-col items-start gap-4">
          <CardHeader>
            <CardTitle class="text-4xl font-light">Monday</CardTitle>
          </CardHeader>
          <CardContent>
            <ul class="list-disc list-inside leading-8">
              <li>John</li>
              <li>David</li>
              <li>Daniel</li>
              <li>Sarah</li>
              <li>Laura</li>
            </ul>
          </CardContent>
        </Card>
        <Card class="flex flex-col items-start gap-4">
          <CardHeader>
            <CardTitle class="text-4xl font-light">Tuesday</CardTitle>
          </CardHeader>
          <CardContent>
            <ul class="list-disc list-inside leading-8">
              <li>John</li>
              <li>David</li>
            </ul>
          </CardContent>
        </Card>
        <Card class="flex flex-col items-start gap-4">
          <CardHeader>
            <CardTitle class="text-4xl font-light">Wednesday</CardTitle>
          </CardHeader>
          <CardContent>
            <ul class="list-disc list-inside leading-8">
              <li>John</li>
              <li>David</li>
              <li>Daniel</li>
              <li>Sarah</li>
              <li>Laura</li>
            </ul>
          </CardContent>
        </Card>
        <Card class="flex flex-col items-start gap-4">
          <CardHeader>
            <CardTitle class="text-4xl font-light">Thursday</CardTitle>
          </CardHeader>
          <CardContent>
            <ul class="list-disc list-inside leading-8">
              <li>John</li>
              <li>David</li>
              <li>Daniel</li>
              <li>Sarah</li>
              <li>Laura</li>
            </ul>
          </CardContent>
        </Card>
        <Card class="flex flex-col items-start gap-4">
          <CardHeader>
            <CardTitle class="text-4xl font-light">Friday</CardTitle>
          </CardHeader>
          <CardContent>
            <ul class="list-disc list-inside leading-8">
              <li>John</li>
              <li>David</li>
              <li>Daniel</li>
              <li>Sarah</li>
              <li>Laura</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
