import { FlatList } from 'react-native';
import { useState } from 'react';

import * as S from './styles';

import { products } from '../../mocks/products';

import { Text } from '../Text';
import { PlusCircle } from '../Icons/PlusCircle';
import { ProductModal } from '../ProductModal';

import { formatCurrent } from '../../utils/formatCurrency';
import { Product } from '../../types/Product';

interface MenuProps {
  onAddToCart: (product: Product) => void;
}

export function Menu({ onAddToCart }: MenuProps) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  function handleOpenModal(product: Product) {
    setIsModalVisible(true);
    setSelectedProduct(product);
  }

  return (
    <>
      <ProductModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        product={selectedProduct}
        onAddToCart={onAddToCart}
      />

      <FlatList
        data={ products }
        style={ {marginTop: 32 }}
        contentContainerStyle={{ paddingHorizontal: 24 }}
        keyExtractor={product => product._id}
        ItemSeparatorComponent={S.Separator}
        renderItem={({ item: product }) => (
          <S.Product onPress={() => handleOpenModal(product)}>
            <S.Image
              source={{
                uri: `http://192.168.18.7:3001/uploads/${product.imagePath}`
              }}
            />
            <S.ProductDetails>
              <Text weight="600">{product.name}</Text>

              <Text size={14} color="#666" style={{ marginVertical: 8 }}>
                {product.description}
              </Text>

              <Text size={14} weight="600">{formatCurrent(product.price)}</Text>
            </S.ProductDetails>

            <S.AddToCartButton onPress={() => onAddToCart(product)}>
              <PlusCircle />
            </S.AddToCartButton>
          </S.Product>
        )}
      />
    </>
  );
}
