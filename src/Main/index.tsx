import { ActivityIndicator } from 'react-native';
import { useEffect, useState } from 'react';

import * as S from './styles';

import { Button } from '../components/Button';
import { Categories } from '../components/Categories';
import {Header} from '../components/Header';
import { Menu } from '../components/Menu';
import { TableModal } from '../components/TableModal';
import { Cart } from '../components/Cart';

import { Product } from '../types/Product';
import { Category } from '../types/Category';
import { CartItem } from '../types/cartItem';

import { api } from '../utils/api';

import { Empty } from '../components/Icons/Empty';
import { Text } from '../components/Text';

export function Main() {
  const [isTableModaVisible, setIsTableModaVisible] = useState(false);
  const [selectedTable, setSelectedTable] = useState('');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);

  useEffect(() => {
    Promise.all([
      api.get('/categories'),
      api.get('/products'),
    ]).then(([ categoryResponse, productResponse ]) => {
      setCategories(categoryResponse.data);
      setProducts(productResponse.data);
      setIsLoading(false);
    });
  }, []);

  function handleSaveTable(table: string) {
    setSelectedTable(table);
  }

  function handleResetOrder() {
    setSelectedTable('');
    setCartItems([]);
  }

  async function handleSelectCategory(categoryId: string) {
    const route = !categoryId
      ? '/products'
      : `/categories/${categoryId}/products`;

    setIsLoadingProducts(true);

    const { data } = await api.get(route);
    setProducts(data);
    setIsLoadingProducts(false);
  }

  function handleAddToCart(product: Product) {
    if (!selectedTable) {
      setIsTableModaVisible(true);
    }
    setCartItems((prevState) => {
      const itemIndex = prevState.findIndex(
        cartItem => cartItem.product._id === product._id
      );

      if (itemIndex < 0) {
        return prevState.concat({
          quantity: 1,
          product,
        });
      }

      const newCartItems = [...prevState];
      const item = newCartItems[itemIndex];

      newCartItems[itemIndex] = {
        ...item,
        quantity: item.quantity + 1,
      };

      return newCartItems;
    });
  }

  function handleDecrementCartItem(product: Product) {
    setCartItems((prevState) => {
      const itemIndex = prevState.findIndex(
        cartItem => cartItem.product._id === product._id
      );

      const item = prevState[itemIndex];
      const newCartItems = [...prevState];

      if(item.quantity === 1) {
        newCartItems.splice(itemIndex, 1);

        return newCartItems;
      }

      newCartItems[itemIndex] = {
        ...item,
        quantity: item.quantity - 1,
      };

      return newCartItems;
    });
  }

  return (
    <>
      <S.Container>
        <Header
          selectedTable={selectedTable}
          onCancelOrder={handleResetOrder}
        />

        {isLoading ? (
          <S.CenteredContainer>
            <ActivityIndicator color="#D73035" size='large'/>
          </S.CenteredContainer>
        ) : (
          <>
            <S.CategoriesContainer>
              <Categories
                onSelectCategory={handleSelectCategory}
                categories={categories}
              />
            </S.CategoriesContainer>

            {isLoadingProducts ? (
              <S.CenteredContainer>
                <ActivityIndicator color="#D73035" size='large'/>
              </S.CenteredContainer>
            ): (
              <>
                {products.length > 0 ? (
                  <S.MenuContainer>
                    <Menu
                      onAddToCart={handleAddToCart}
                      products={products}
                    />
                  </S.MenuContainer>
                ) : (
                  <S.CenteredContainer>
                    <Empty />
                    <Text color="#666" style={{ marginTop: 24 }}>Nenhum produto foi encontrado!</Text>
                  </S.CenteredContainer>
                )}
              </>
            )}
          </>
        )}

      </S.Container>

      <S.Footer>
        <S.FooterContainer>
          {!selectedTable && (
            <Button
              onPress={() => setIsTableModaVisible(true)}
              disabled={isLoading}
            >
            Novo pedido
            </Button>
          )}

          {selectedTable && (
            <Cart
              selectedTable={selectedTable}
              cartItems={cartItems}
              onAdd={handleAddToCart}
              onDecrement={handleDecrementCartItem}
              onConfirmOrder={handleResetOrder}
            />
          )}
        </S.FooterContainer>
      </S.Footer>

      <TableModal
        visible={isTableModaVisible}
        onClose={() => setIsTableModaVisible(false)}
        onSave={handleSaveTable}
      />
    </>
  );
}

