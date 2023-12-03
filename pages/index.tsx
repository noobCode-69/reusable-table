import theme from "@/src/styles/theme";
import Container from "@/src/ui/primitives/Container";

import {
  Table,
  Thead,
  Tr,
  Th,
  TableContainer,
  Tbody,
  Td,
  Checkbox,
  HStack,
  Spacer,
  IconButton,
  Input,
  Box,
  VStack,
  Skeleton,
} from "@chakra-ui/react";

import {
  FaAngleLeft,
  FaAngleDoubleLeft,
  FaAngleRight,
  FaAngleDoubleRight,
} from "react-icons/fa";
import { FiEdit } from "react-icons/fi";

import { IoSaveOutline } from "react-icons/io5";
import { AiOutlineDelete } from "react-icons/ai";
import Text from "@/src/ui/primitives/Text";
import useTable from "@/src/hooks/useTable";

type PaginationButtonProps = {
  onClick: () => void;
  icon: any;
  ariaLabel: string;
};
const PaginationButton = ({
  onClick,
  icon,
  ariaLabel,
}: PaginationButtonProps) => {
  return (
    <IconButton
      size={"sm"}
      bg={"transparent"}
      _hover={{}}
      _focus={{}}
      border={"1px solid"}
      borderColor={theme.colors._lightgray}
      aria-label={ariaLabel}
      onClick={onClick}
      icon={icon}
    />
  );
};

const LoadingSkeletonTable = () => {
  const skeletonRows = 10;

  return (
    <Container py={{ md: 20, base: 10 }}>
      <Table>
        <Thead>
          <Tr>
            <Th>
              <Skeleton height="20px" width="20px" />
            </Th>
            <Th>
              <Skeleton height="20px" width="100px" />
            </Th>
            <Th>
              <Skeleton height="20px" width="100px" />
            </Th>
            <Th>
              <Skeleton height="20px" width="80px" />
            </Th>
          </Tr>
        </Thead>

        <Tbody>
          {Array.from({ length: skeletonRows }).map((_, index) => (
            <Tr key={index}>
              <Td>
                <Skeleton height="20px" width="20px" />
              </Td>
              <Td>
                <Skeleton height="20px" width="100px" />
              </Td>
              <Td>
                <Skeleton height="20px" width="100px" />
              </Td>
              <Td>
                <Skeleton height="20px" width="80px" />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Container>
  );
};

const ErrorComponent = () => {
  return (
    <Container py={{ md: 20, base: 10 }}>
      <Box w="full" top={0} left={0} py={5}>
        <Text textAlign="center" fontWeight="medium">
          An error occurred
        </Text>
      </Box>
    </Container>
  );
};

export default function Home() {
  const {
    loading,
    error,
    pageTableData,
    totalSelectedItems,
    totalItem,
    totalPages,
    currentPage,
    moveToOnePageUp,
    moveToOnePageDown,
    moveToFirstPage,
    moveToLastPage,
    isAllSelectedInPage,
    toggleRowSelection,
    togglePageSelection,
    searchValue,
    search,
    isEmpty,
    deleteRowSection,
    deleteSelected,
    makeEditableRowSelection,
    saveRowSection,

    editRowSection,
  } = useTable<{ id: number; name: string; email: string; role: string }>({
    dataSource:
      "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json",
    rowIdentifier: "id",
  });

  if (loading) return <LoadingSkeletonTable />;
  if (error) return <ErrorComponent />;

  return (
    <>
      <Container py={{ md: 20, base: 10 }}>
        <VStack alignItems={"flex-start"} gap={5}>
          <HStack
            justifyContent={"stretch"}
            w={"full"}
            gap={5}
            fontSize={"sm"}
            color={theme.colors._gray}
          >
            <Input
              maxW={375}
              value={searchValue}
              onChange={(e) => search(e.target.value)}
              focusBorderColor="lightgray"
              placeholder="Search"
            />
            <Spacer />
            <IconButton
              bg={"transparent"}
              _hover={{}}
              _focus={{}}
              border={"1px solid"}
              borderColor={theme.colors._lightgray}
              aria-label={"delete-row"}
              onClick={deleteSelected}
              icon={<AiOutlineDelete />}
            />
          </HStack>
          <TableContainer
            w={"full"}
            border={"1px solid"}
            borderColor={theme.colors._lightgray}
            overflow={"hidden"}
            borderRadius={"xl"}
          >
            {isEmpty ? (
              <Box
                w="full"
                top={0}
                left={0}
                outline="1px solid red"
                py={5}
                zIndex={1}
              >
                <Text
                  textAlign="center"
                  fontWeight="medium"
                  color={theme.colors._gray}
                >
                  No Item Found (try removing some filters)
                </Text>
              </Box>
            ) : (
              <Table>
                <Thead>
                  <Tr>
                    <Th>
                      <Checkbox
                        colorScheme="gray"
                        isChecked={isAllSelectedInPage}
                        onChange={togglePageSelection}
                      />
                    </Th>
                    <Th>
                      <Text>Name</Text>
                    </Th>
                    <Th>
                      <Text>Email</Text>
                    </Th>
                    <Th>
                      <Text>Role</Text>
                    </Th>
                    <Th>
                      <Text>Actions</Text>
                    </Th>
                  </Tr>
                </Thead>

                <Tbody>
                  {pageTableData.map((item: any, index: number) => (
                    <Tr
                      bg={item.isSelected ? theme.colors._lightgray : "initial"}
                      key={index}
                    >
                      <Td>
                        <Checkbox
                          colorScheme="gray"
                          isChecked={item.isSelected}
                          onChange={() => toggleRowSelection(item.id)}
                        />
                      </Td>
                      <Td>
                        {item.isEditable ? (
                          <Input
                            focusBorderColor="lightgray"
                            defaultValue={item.name}
                            onChange={(e) => {
                              editRowSection(item.id, "name", e.target.value);
                            }}
                          />
                        ) : (
                          <Text>{item.name}</Text>
                        )}
                      </Td>
                      <Td>
                        {item.isEditable ? (
                          <Input
                            focusBorderColor="lightgray"
                            defaultValue={item.email}
                            onChange={(e) => {
                              editRowSection(item.id, "email", e.target.value);
                            }}
                          />
                        ) : (
                          <Text>{item.email}</Text>
                        )}
                      </Td>
                      <Td>
                        {item.isEditable ? (
                          <Input
                            focusBorderColor="lightgray"
                            defaultValue={item.role}
                            onChange={(e) => {
                              editRowSection(item.id, "role", e.target.value);
                            }}
                          />
                        ) : (
                          <Text>{item.role}</Text>
                        )}
                      </Td>
                      <Td>
                        <HStack>
                          <IconButton
                            bg={"transparent"}
                            _hover={{}}
                            _focus={{}}
                            border={"1px solid"}
                            borderColor={theme.colors._lightgray}
                            aria-label={"delete-row"}
                            onClick={() => {
                              deleteRowSection(item.id);
                            }}
                            icon={<AiOutlineDelete />}
                          />
                          {item.isEditable ? (
                            <IconButton
                              bg={"transparent"}
                              _hover={{}}
                              _focus={{}}
                              border={"1px solid"}
                              borderColor={theme.colors._lightgray}
                              aria-label={"save-row"}
                              onClick={() => {
                                saveRowSection(item.id);
                              }}
                              icon={<IoSaveOutline />}
                            />
                          ) : (
                            <IconButton
                              bg={"transparent"}
                              _hover={{}}
                              _focus={{}}
                              border={"1px solid"}
                              borderColor={theme.colors._lightgray}
                              aria-label={"edit-row"}
                              onClick={() => {
                                makeEditableRowSelection(item.id);
                              }}
                              icon={<FiEdit />}
                            />
                          )}
                        </HStack>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            )}
          </TableContainer>
          <HStack w={"full"} gap={5} fontSize={"sm"} color={theme.colors._gray}>
            <Text fontSize={"sm"} color={theme.colors._gray}>
              {totalSelectedItems} of {totalItem} row(s) selected
            </Text>
            <Spacer />
            <Text>
              Page {currentPage} of {totalPages}
            </Text>
            <HStack gap={2}>
              <PaginationButton
                ariaLabel="first-page"
                onClick={moveToFirstPage}
                icon={<FaAngleDoubleLeft color={theme.colors._gray} />}
              />
              <PaginationButton
                ariaLabel="previous-page"
                onClick={moveToOnePageDown}
                icon={<FaAngleLeft color={theme.colors._gray} />}
              />
              <PaginationButton
                ariaLabel="current-page"
                onClick={() => {}}
                icon={
                  <Text fontSize={"sm"} color={theme.colors._gray}>
                    {currentPage}
                  </Text>
                }
              />
              <PaginationButton
                ariaLabel="next-page"
                onClick={moveToOnePageUp}
                icon={<FaAngleRight color={theme.colors._gray} />}
              />
              <PaginationButton
                ariaLabel="last-page"
                onClick={moveToLastPage}
                icon={<FaAngleDoubleRight color={theme.colors._gray} />}
              />
            </HStack>
          </HStack>
        </VStack>
      </Container>
    </>
  );
}
