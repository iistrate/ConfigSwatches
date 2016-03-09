<?php
/**
 * Created by PhpStorm.
 * User: mighty ioanistrate
 * Date: 10/8/15
 * Time: 3:17 PM
 */
?>
<?php
    class GaugeInteractive_CustomSwatches_SwatchesController extends Mage_Core_Controller_Front_Action {

       public function indexAction()
       {
           //get product id
           $pid = Mage::app()->getRequest()->getParam('pid');
           if (!$pid) return;

           //load product
           $product = Mage::getModel("catalog/product")->load($pid);

           //load media images
           $mediaImages = $product->getMediaGalleryImages();

           $data = [];
           foreach ($mediaImages as $image):

               $data_image = [
                   'thumb' => (string) Mage::helper('catalog/image')->init($product, 'thumbnail', $image->getFile())->resize(200),
                   'image' => (string) Mage::helper('catalog/image')->init($product, 'image', $image->getFile())->resize(1200)
               ];

                array_push($data, $data_image);

            endforeach;

           header('Content-Type: application/json');
           echo json_encode($data);
       }
    }

?>
