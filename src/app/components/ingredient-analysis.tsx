import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Trash2, Plus } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Ingredient, IngredientCategory } from '@/model/models';
import { Label } from '@/components/ui/label';

interface IngredientAnalysisProps {
  ingredients: Ingredient[];
  onUpdate: (
    id: string,
    field: keyof Ingredient,
    value: string | string[],
  ) => void;
  onRemove: (id: string) => void;
  onAdd: () => void;
}

export function IngredientAnalysis({
  ingredients,
  onUpdate,
  onRemove,
  onAdd,
}: IngredientAnalysisProps) {
  if (ingredients.length === 0) {
    return null;
  }

  const isExistingIngredient = (ingredient: Ingredient) => {
    return !!ingredient.ingredientId;
  };

  return (
    <div className='mt-8 space-y-8'>
      <h2 className='text-lg font-semibold mb-4'>Analyzed Ingredients</h2>
      <Table className='w-full'>
        <TableHeader className='hidden md:table-header-group'>
          <TableRow>
            <TableHead>Amount</TableHead>
            <TableHead>Ingredient</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Aliases</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ingredients.map((ingredient) => (
            <TableRow
              key={ingredient.id}
              className='flex flex-col md:table-row'
            >
              <TableCell id='name'>
                <Label htmlFor='name' className='md:hidden mb-1'>
                  Amount
                </Label>
                <Input
                  value={ingredient.amount}
                  onChange={(e) =>
                    onUpdate(ingredient.id, 'amount', e.target.value)
                  }
                  className='w-full'
                />
              </TableCell>
              <TableCell id='ingredient'>
                <Label htmlFor='ingredient' className='md:hidden mb-1'>
                  Ingredient
                </Label>
                <Input
                  value={ingredient.name}
                  onChange={(e) =>
                    onUpdate(ingredient.id, 'name', e.target.value)
                  }
                  className='w-full'
                />
              </TableCell>
              <TableCell id='category'>
                <Label htmlFor='category' className='md:hidden mb-1'>
                  Category
                </Label>
                <Select
                  value={ingredient.category}
                  onValueChange={(value) =>
                    onUpdate(
                      ingredient.id,
                      'category',
                      value as Ingredient['category'],
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Select category' />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(IngredientCategory).map(
                      (ingredientCategory) => (
                        <SelectItem
                          key={ingredientCategory}
                          value={ingredientCategory}
                        >
                          {ingredientCategory}
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell id='aliases'>
                <Label htmlFor='aliases' className='md:hidden'>
                  Aliases
                </Label>
                <Input
                  value={ingredient.aliases?.join(', ')}
                  onChange={(e) =>
                    onUpdate(
                      ingredient.id,
                      'aliases',
                      e.target.value.split(',').map((alias) => alias.trim()),
                    )
                  }
                  placeholder='Comma-separated aliases'
                  className='w-full'
                />
              </TableCell>
              <TableCell id='status'>
                <Label htmlFor='status' className='md:hidden'>
                  Status
                </Label>
                <div>
                  {isExistingIngredient(ingredient) ? (
                    <span className='text-yellow-600 px-2 py-1 rounded-full text-sm'>
                      Existing
                    </span>
                  ) : (
                    <span className='text-green-700 px-2 py-1 rounded-full text-sm'>
                      New
                    </span>
                  )}
                </div>
              </TableCell>
              <TableCell id='actions'>
                <Label htmlFor='actions' className='md:hidden'>
                  Actions
                </Label>
                <div>
                  <Button
                    variant='ghost'
                    size='icon'
                    onClick={() => onRemove(ingredient.id)}
                    className='text-red-500 hover:text-red-700'
                  >
                    <Trash2 className='h-4 w-4' />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Button type='button' onClick={onAdd} className='mt-4 w-full md:w-auto'>
        <Plus className='h-4 w-4 mr-2' /> Add Ingredient
      </Button>
    </div>
  );
}
