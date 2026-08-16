import { Pill, Button, Flex, Input, Pagination, Stack, Table, Typography, TableScrollContainer, Title, Image } from '@mantine/core'
import { notifications } from '@mantine/notifications';
import './App.css'
import allItems from "./assets/data/acnh/all-items.json"
import { useEffect, useState, type ChangeEventHandler } from 'react'
import Fuse from 'fuse.js'


export type Item = {
  name: string,
  hexCode: string,
  group: string,
}

export type Page<T> = {
  items: T[]
}

const PAGE_SIZE = 100
const DEFAULT_COLOR = "teal"
const NOTIFICATION_TIMEOUT = 2000

function App() {
  const [selectedItems, setSelectedItems] = useState<Item[]>([])
  const [filteredItems, setFilteredItems] = useState<Item[]>(allItems)
  const [currentPageIndex, setCurrentPageIndex] = useState(1)
  const [pageCount, setPageCount] = useState(1)
  const [currentPage, setcurrentPage] = useState<Item[]>([])

  const copyCode = async (code: string) => {
    navigator.clipboard.writeText(code).then(() => {
      notifications.show({ message: 'Code Copied', autoClose: NOTIFICATION_TIMEOUT, position: 'bottom-center', color:DEFAULT_COLOR });
    })
  }

  const copyOrder = async () => {
    const codes = selectedItems.map(item => item.hexCode)
    const order = `~ order ${codes.join(' ')}`
    navigator.clipboard.writeText(order).then(() => {
      notifications.show({ message: 'Order Copied', autoClose: NOTIFICATION_TIMEOUT, position: 'bottom-center', color:DEFAULT_COLOR });
    })
  }

  const addSelectedItem = (item: Item) => {
    setSelectedItems(items => [...items, item])
  }

  const removeSelectedItem = (index: number) => {
    let copy = [...selectedItems]
    copy.splice(index, 1);
    setSelectedItems(copy)
  }

  const fuse = new Fuse(allItems, { keys: ['name'], threshold: 0.1 })
  const search: ChangeEventHandler<HTMLInputElement> = e => {
    const searchInput = e.currentTarget.value
    const results = fuse.search(searchInput)
    setFilteredItems(results.map(result => result.item))
  }

  useEffect(() => {
    const lowerIndex = (currentPageIndex - 1) * PAGE_SIZE
    const upperIndex = lowerIndex + PAGE_SIZE
    const page = filteredItems.slice(lowerIndex, upperIndex)
    setcurrentPage(page)
  }, [filteredItems, currentPageIndex])

  useEffect(() => {
    setPageCount(Math.floor(filteredItems.length / PAGE_SIZE))
    setCurrentPageIndex(1)
  }, [filteredItems])

  return (
    <Flex dir='column' style={{ width: '100%', justifyContent: "center", paddingTop: "10px" }}>

      <Stack gap={15} style={{ maxWidth: "1000px", width: '50vw' }}>
        <Flex align='flex-end' gap={10}>
          <Image src='/favicon.png' h='50px' w='auto'/>
          <Title>Kelly's Items</Title>
        </Flex>
        <Stack gap={5}>
          <Typography style={{ minWidth: '125px' }}>Selected Items:</Typography>
          <Pill.Group style={{ height: "50px", overflow: "scroll"}}>
            {selectedItems.map((item, i) => (
              <Pill size='lg' key={item.group + item.hexCode + i} onClick={() => removeSelectedItem(i)} style={{ cursor: "pointer" }}> {item.name} </Pill>
            ))}
          </Pill.Group>
        </Stack>

        <Input onChange={search} placeholder="Search Items..." />
        <TableScrollContainer minWidth={'500px'} maxHeight={'70vh'} style={{minHeight:'65vh'}}>

          <Table highlightOnHover stickyHeader>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>
                  Item Name
                </Table.Th>
                <Table.Th>
                  Code
                </Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {currentPage.map(item => (
                <Table.Tr key={item.hexCode + item.group} onClick={() => addSelectedItem(item)} style={{ cursor: 'pointer' }}>
                  <Table.Td>
                    {item.name}
                  </Table.Td>
                  <Table.Td>
                    <Button color={DEFAULT_COLOR} variant='light' onClick={e => { e.stopPropagation(); copyCode(item.hexCode) }}>
                      {item.hexCode}
                    </Button>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </TableScrollContainer>
        <Flex justify={'space-between'}>
          <Pagination total={pageCount} value={currentPageIndex} onChange={setCurrentPageIndex} color={DEFAULT_COLOR} />
          <Flex gap={5} >
            <Button onClick={() => setSelectedItems([])} variant='light' color={DEFAULT_COLOR}>Clear Order</Button>
            <Button onClick={copyOrder} color={DEFAULT_COLOR}>Copy Order</Button>
          </Flex>
        </Flex>
      </Stack>
    </Flex>
  )
}

export default App
