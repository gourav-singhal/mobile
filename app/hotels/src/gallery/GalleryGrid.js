// @flow

import * as React from 'react';
import { FlatList } from 'react-native';
import {
  GeneralError,
  Modal,
  StyleSheet,
  type OnLayout,
  type DimensionType,
} from '@kiwicom/mobile-shared';
import { Translation } from '@kiwicom/mobile-localization';
import { type NavigationType, HeaderTitle } from '@kiwicom/mobile-navigation';

import GalleryGridTile from './GalleryGridTile';
import PhotosStripe from './PhotosStripe';

const tileGap = 2;
const tilesInRow = 3;

const styles = StyleSheet.create({
  modal: {
    margin: 0,
  },
});

export type Image = {
  key: string,
  lowRes: string,
  highRes: string,
};

type Props = {|
  +navigation: NavigationType,
  +hotelName: string,
  +dimensions: DimensionType,
  +images: Image[],
  +onGoToGalleryStripe: (
    hotelName: string,
    highResImages: string[],
    imageIndex: number,
  ) => void,
|};

type State = {|
  tileWidth: number,
  stripeVisible: boolean,
  stripeImageIndex: number,
|};

const getTileWidth = (width: number) => {
  return (width - tileGap * (tilesInRow - 1)) / tilesInRow;
};

export default class GalleryGrid extends React.Component<Props, State> {
  static navigationOptions = ({ navigation }: Props) => ({
    gesturesEnabled: navigation.state.params.isGesturesEnabled,
    headerTitle: (
      <HeaderTitle>
        <Translation id="hotels.navigation.title.gallery_grid" />
      </HeaderTitle>
    ),
  });

  state = {
    /**
     * This assumes that the gallery is expanded over the whole screen
     * without additional paddings (this is how it's designed).
     *
     * Event `onLayout` attached to the `FlatList` is called after all
     * images are loaded which is too late (works good on iOS). But it's
     * still needed for portrait <-> layout changes.
     */
    tileWidth: getTileWidth(this.props.dimensions.width),
    stripeVisible: false,
    stripeImageIndex: 0,
  };

  componentDidMount = () => {
    this.props.navigation.setParams({
      isGesturesEnabled: true,
    });
  };

  calculateTileWidth = (event: OnLayout) => {
    const width = event.nativeEvent.layout.width;
    this.setState({
      tileWidth: getTileWidth(width),
    });
  };

  openStripe = (imageIndex: number) => {
    this.setState({
      stripeVisible: true,
      stripeImageIndex: imageIndex,
    });

    this.props.navigation.setParams({
      isGesturesEnabled: false,
    });
  };

  closeStripe = () => {
    this.setState({
      stripeVisible: false,
    });

    this.props.navigation.setParams({
      isGesturesEnabled: true,
    });
  };

  renderItem = ({ item, index }: { item: Image, index: number }) => (
    <GalleryGridTile
      imageUrl={item.lowRes}
      imageIndex={index}
      gap={tileGap}
      width={this.state.tileWidth}
      lastInRow={(index + 1) % tilesInRow === 0}
      onTilePress={this.openStripe}
    />
  );

  render = () => {
    if (this.props.images) {
      return (
        <React.Fragment>
          <FlatList
            data={this.props.images}
            extraData={this.state}
            renderItem={this.renderItem}
            numColumns={tilesInRow}
            onLayout={this.calculateTileWidth}
          />
          <Modal
            isVisible={this.state.stripeVisible}
            backdropColor="black"
            backdropOpacity={1}
            style={styles.modal}
            onRequestClose={this.closeStripe}
          >
            <PhotosStripe
              hotelName={this.props.hotelName}
              imageUrls={this.props.images.map(image => image.highRes)}
              index={this.state.stripeImageIndex}
              onClose={this.closeStripe}
            />
          </Modal>
        </React.Fragment>
      );
    }

    return (
      <GeneralError
        errorMessage={<Translation id="hotels.gallery_grid.no_images" />}
      />
    );
  };
}
