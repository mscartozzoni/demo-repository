import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, PlusCircle, Package, Edit, Trash2, Search } from 'lucide-react';

let mockProducts = [
    { id: 1, name: 'Consulta Padrão', description: 'Avaliação completa com o especialista.', price: 500.00, image_url: '' },
    { id: 2, name: 'Pacote Pós-operatório', description: 'Inclui 5 sessões de drenagem linfática.', price: 1500.00, image_url: '' },
];

const Products = () => {
    const [products, setProducts] = useState(mockProducts);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const { toast } = useToast();
    const location = useLocation();
    const navigate = useNavigate();

    const fetchProducts = useCallback(() => {
        setLoading(true);
        setTimeout(() => {
            setProducts(mockProducts);
            setLoading(false);
        }, 300);
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        if (searchParams.get('action') === 'add') {
            handleAddNew();
            navigate('/products', { replace: true });
        }
    }, [location, navigate]);

    const handleAddNew = () => {
        setSelectedProduct(null);
        setIsModalOpen(true);
    };

    const handleEdit = (product) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    const handleDelete = (product) => {
        setSelectedProduct(product);
        setIsDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        if (!selectedProduct) return;
        mockProducts = mockProducts.filter(p => p.id !== selectedProduct.id);
        toast({ title: 'Produto deletado com sucesso!' });
        fetchProducts();
        setIsDeleteDialogOpen(false);
        setSelectedProduct(null);
    };

    const handleSave = async (formData) => {
        const productData = {
            name: formData.get('name'),
            description: formData.get('description'),
            price: formData.get('price'),
            image_url: formData.get('image_url'),
        };

        if (selectedProduct) {
            const index = mockProducts.findIndex(p => p.id === selectedProduct.id);
            mockProducts[index] = { ...selectedProduct, ...productData };
        } else {
            mockProducts.unshift({ id: Date.now(), ...productData });
        }

        toast({ title: `Produto ${selectedProduct ? 'atualizado' : 'criado'} com sucesso!` });
        fetchProducts();
        setIsModalOpen(false);
        setSelectedProduct(null);
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            <Helmet>
                <title>Produtos - Portal do Médico</title>
                <meta name="description" content="Gerencie seus produtos e serviços." />
            </Helmet>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-2"><Package className="w-8 h-8" /> Produtos</h1>
                    <p className="text-slate-400">Gerencie seu catálogo de produtos e serviços.</p>
                </div>
                <Button onClick={handleAddNew}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Adicionar Produto
                </Button>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-card rounded-xl border border-border"
            >
                <div className="p-4 flex justify-between items-center border-b border-border">
                    <div className="relative w-full max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Buscar produtos..."
                            className="pl-10"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Produto</TableHead>
                                <TableHead>Descrição</TableHead>
                                <TableHead className="text-right">Preço</TableHead>
                                <TableHead className="w-[50px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow><TableCell colSpan={4} className="text-center">Carregando...</TableCell></TableRow>
                            ) : filteredProducts.length > 0 ? (
                                filteredProducts.map(product => (
                                    <TableRow key={product.id}>
                                        <TableCell className="font-medium">{product.name}</TableCell>
                                        <TableCell className="text-muted-foreground max-w-sm truncate">{product.description}</TableCell>
                                        <TableCell className="text-right">R$ {Number(product.price).toFixed(2)}</TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                                        <span className="sr-only">Abrir menu</span>
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => handleEdit(product)}><Edit className="mr-2 h-4 w-4" /> Editar</DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleDelete(product)} className="text-destructive focus:text-destructive"><Trash2 className="mr-2 h-4 w-4" /> Deletar</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow><TableCell colSpan={4} className="text-center">Nenhum produto encontrado.</TableCell></TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </motion.div>

            <ProductModal
                isOpen={isModalOpen}
                setIsOpen={setIsModalOpen}
                product={selectedProduct}
                onSave={handleSave}
            />

            <DeleteConfirmationDialog
                isOpen={isDeleteDialogOpen}
                setIsOpen={setIsDeleteDialogOpen}
                onConfirm={confirmDelete}
            />
        </>
    );
};

const ProductModal = ({ isOpen, setIsOpen, product, onSave }) => {
    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        onSave(formData);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{product ? 'Editar Produto' : 'Adicionar Produto'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">Nome</Label>
                            <Input id="name" name="name" defaultValue={product?.name} className="col-span-3" required />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="description" className="text-right">Descrição</Label>
                            <Textarea id="description" name="description" defaultValue={product?.description} className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="price" className="text-right">Preço</Label>
                            <Input id="price" name="price" type="number" step="0.01" defaultValue={product?.price} className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="image_url" className="text-right">URL da Imagem</Label>
                            <Input id="image_url" name="image_url" defaultValue={product?.image_url} className="col-span-3" />
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="secondary">Cancelar</Button>
                        </DialogClose>
                        <Button type="submit">Salvar</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

const DeleteConfirmationDialog = ({ isOpen, setIsOpen, onConfirm }) => (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Confirmar Exclusão</DialogTitle>
            </DialogHeader>
            <p>Tem certeza de que deseja excluir este produto? Esta ação não pode ser desfeita.</p>
            <DialogFooter>
                <DialogClose asChild>
                    <Button variant="secondary">Cancelar</Button>
                </DialogClose>
                <Button variant="destructive" onClick={onConfirm}>Deletar</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
);

export default Products;