import { Link, useParams } from '@remix-run/react';
import { ChevronDown, Plus } from 'lucide-react';
import { FC, useMemo } from 'react';
import { Button } from '~/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { Office } from '../office/api';

export interface OfficeSelectorProps {
  offices: Office[];
}

export const OfficeSelector: FC<OfficeSelectorProps> = ({ offices }) => {
  const params = useParams<{ officeId?: string }>();

  const activeOffice = useMemo(() => {
    const defaultOffice = offices.find((o) => o.id === params.officeId);

    return defaultOffice;
  }, [offices]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="text-lg font-normal" variant="ghost">
          {activeOffice ? (
            <span>{activeOffice.displayName}</span>
          ) : (
            <span>Select an office</span>
          )}
          <ChevronDown />
          <span className="sr-only">Toggle offices menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {offices.map((office) => (
          <DropdownMenuItem key={office.id} asChild>
            <Link className="cursor-pointer" to={`/office/${office.id}`}>
              {office.displayName}
            </Link>
          </DropdownMenuItem>
        ))}
        <DropdownMenuItem asChild>
          <a
            className="cursor-pointer flex justify-between items-center"
            href="/office/new"
          >
            New office
            <Plus className="w-6 py-0 ml-2" />
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
