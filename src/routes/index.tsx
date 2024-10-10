import { Card, CardHeader, CardTitle, CardContent } from '~/components/ui/card';

export default function Home() {
  return (
    <div class="min-h-screen min-w-screen flex justify-center items-center gap-8 mx-8 flex-wrap">
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
            <li>Daniel</li>
            <li>Sarah</li>
            <li>Laura</li>
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
  );
}
