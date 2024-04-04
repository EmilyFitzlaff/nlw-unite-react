import { Search, MoreHorizontal, ChevronsLeft, ChevronLeft, ChevronsRight, ChevronRight } from 'lucide-react'
import { IconButton } from './icon-button'
import { Table } from './table/table'
import { TableHeader } from './table/table-header'
import { TableCell } from './table/table-cell'
import { TableRow } from './table/table-row'
import { ChangeEvent, useEffect, useState } from 'react'
import dayjs from 'dayjs'
import 'dayjs/locale/pt-br'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime);
dayjs.locale('pt-br');

interface IAttendee {
    id: number;          
    name: string;
    email: string;
    createdAt: Date | string;
    checkedInAt: Date | string;
}

export function AttendeeList() {
  const [search, setSearch] = useState<string>(() => {
    const url = new URL(window.location.toString());

    if (url.searchParams.has('search')) {
        return url.searchParams.get('search') ?? ''
    }

    return '';
  });
  const [page, setPage] = useState<number>(() => {
    const url = new URL(window.location.toString());

    if (url.searchParams.has('page')) {
        return Number(url.searchParams.get('page'))
    }

    return 1;
  });
  const [totalItems, setTotalItems] = useState<number>(0);
  const [attendees, setAttendees] = useState<IAttendee[]>([]);

  const limit = 10;

  const lastPage = Math.ceil(totalItems / limit);

  useEffect(() => {
    const url = new URL('http://localhost:3333/events/9e9bd979-9d10-4915-b339-3786b1634f33/attendees');

    url.searchParams.set('pageIndex', String(page - 1));

    if (search.length > 0) {
        url.searchParams.set('query', search);
    }
   
    fetch(url)
        .then(response => response.json())
        .then(data => {
            setAttendees(data.attendees);
            setTotalItems(data.total)
        })
  }, [page, search]);

  function setCurrentPage(page: number) {
    const url = new URL(window.location.toString());
    url.searchParams.set('page', String(page));
    window.history.pushState({}, "", url);
    setPage(page);
  }

  function setCurrentSearch(search: string) {
    const url = new URL(window.location.toString());
    url.searchParams.set('search', search);
    window.history.pushState({}, "", url);
    setSearch(search);
  }

  function onSearchInputChange(event: ChangeEvent<HTMLInputElement>) {
    setCurrentSearch(event.target.value)
    setCurrentPage(1)
  }

  function goToNextPage() {
    setCurrentPage(page + 1)
  }

  function goToPreviousPage() {
    setCurrentPage(page - 1);
  }

  function goToFirstPage() {
    setCurrentPage(1);
  }

  function goToLastPage() {
    setCurrentPage(lastPage);
  }

  return (
    <div className='flex flex-col gap-4'>
        <div className='flex gap-3 items-center'>
            <h1 className='text-2xl font-bold'>Participantes</h1>

            <div className='w-72 px-3 py-1.5 border border-white/10 rounded-lg text-sm flex items-center gap-3'>
                <Search className='size-4 text-emerald-300'/>
                <input 
                    type='text' 
                    placeholder='Buscar participantes...' 
                    className='bg-transparent flex-1 outline-none h-auto border-0 p-0 text-sm'
                    value={search}
                    onChange={onSearchInputChange}
                />
            </div>
        </div>

        <Table>
            <thead>
                <TableRow>
                    <TableHeader style={{ width: 48 }}>
                        <input type="checkbox" className='size-4 bg-black/20 rounded border border-white/10 checked:bg-orange-400' />
                    </TableHeader>
                    <TableHeader>Código</TableHeader>
                    <TableHeader>Participante</TableHeader>
                    <TableHeader>Data de inscrição</TableHeader>
                    <TableHeader>Data do check-in</TableHeader>
                    <TableHeader style={{ width: 64 }} />
                </TableRow>
            </thead>

            <tbody>
                {attendees.length === 0 && (
                    <TableRow key="no-items" >
                         <TableCell colSpan={6} textAlign='text-center'>
                            <span>Nenhum item para exibição!</span>
                        </TableCell>
                    </TableRow>
                )}
                {attendees.map((attendee: IAttendee) => {
                    return (
                        <TableRow key={attendee.id}>
                            <TableCell>
                                <input type="checkbox" className='size-4 bg-black/20 rounded border border-white/10 checked:bg-orange-400' />
                            </TableCell>
                            <TableCell>{attendee.id}</TableCell>
                            <TableCell>
                                <div className='flex flex-col gap-1'>
                                    <span className='font-semibold text-white'>{attendee.name}</span>
                                    <span>{attendee.email}</span>
                                </div>
                            </TableCell>
                            <TableCell>{dayjs().to(attendee.createdAt)}</TableCell>
                            <TableCell>
                                {attendee.checkedInAt === null 
                                    ? 'Não realizou check-in' 
                                    : dayjs().to(attendee.checkedInAt)}
                            </TableCell>
                            <TableCell>
                                <IconButton transparent>
                                    <MoreHorizontal className='size-4' />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    )
                })}
            </tbody>
            
            {attendees.length > 0 && (
                <tfoot>
                    <tr>
                        <TableCell colSpan={3}>
                            Mostrando {attendees.length} de {totalItems}
                        </TableCell>
                        <TableCell colSpan={3} textAlign='text-right'>
                            <div className='inline-flex items-center gap-8'>
                                <span>Página {page} de {lastPage}</span>
                                <div className='flex gap-1.5'>
                                    <IconButton onClick={goToFirstPage} disabled={page === 1}>
                                        <ChevronsLeft className='size-4' />
                                    </IconButton>
                                    <IconButton onClick={goToPreviousPage} disabled={page === 1}>
                                        <ChevronLeft className='size-4' />
                                    </IconButton>
                                    <IconButton onClick={goToNextPage} disabled={page === lastPage}>
                                        <ChevronRight className='size-4' />
                                    </IconButton>
                                    <IconButton onClick={goToLastPage} disabled={page === lastPage}>
                                        <ChevronsRight className='size-4' />
                                    </IconButton>
                                </div>
                            </div>
                        </TableCell>
                    </tr>
                </tfoot>
            )}
        </Table>
    </div>
  )
}
